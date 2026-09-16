#!/bin/sh
set -eu

: "${DOMAIN:?DOMAIN is required, for example www.example.com}"
: "${CERTBOT_EMAIL:?CERTBOT_EMAIL is required}"

CERTBOT_WEBROOT=/var/www/certbot
BOOTSTRAP_DIR=/etc/nginx/bootstrap-tls
LIVE_DIR=/etc/letsencrypt/live/${DOMAIN}
NGINX_TEMPLATE=/etc/nginx/templates/site.conf.template
NGINX_CONFIG=/etc/nginx/conf.d/site.conf

SERVER_NAMES="${DOMAIN}"
if [ -n "${WWW_DOMAIN:-}" ] && [ "${WWW_DOMAIN}" != "${DOMAIN}" ]; then
  SERVER_NAMES="${DOMAIN} ${WWW_DOMAIN}"
fi
export SERVER_NAMES

mkdir -p "${CERTBOT_WEBROOT}" "${BOOTSTRAP_DIR}" /etc/nginx/conf.d

render_nginx() {
  export CERT_FULLCHAIN CERT_PRIVKEY
  envsubst '${SERVER_NAMES} ${CERT_FULLCHAIN} ${CERT_PRIVKEY}' < "${NGINX_TEMPLATE}" > "${NGINX_CONFIG}"
  nginx -t
}

use_bootstrap_certificate() {
  if [ ! -s "${BOOTSTRAP_DIR}/fullchain.pem" ] || [ ! -s "${BOOTSTRAP_DIR}/privkey.pem" ]; then
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout "${BOOTSTRAP_DIR}/privkey.pem" \
      -out "${BOOTSTRAP_DIR}/fullchain.pem" \
      -subj "/CN=${DOMAIN}" \
      -addext "subjectAltName=DNS:${DOMAIN}" >/dev/null 2>&1
  fi
  CERT_FULLCHAIN="${BOOTSTRAP_DIR}/fullchain.pem"
  CERT_PRIVKEY="${BOOTSTRAP_DIR}/privkey.pem"
}

use_live_certificate() {
  CERT_FULLCHAIN="${LIVE_DIR}/fullchain.pem"
  CERT_PRIVKEY="${LIVE_DIR}/privkey.pem"
}

request_certificate() {
  set -- certbot certonly --webroot -w "${CERTBOT_WEBROOT}" \
    --non-interactive --agree-tos --email "${CERTBOT_EMAIL}" \
    --cert-name "${DOMAIN}" -d "${DOMAIN}"
  if [ -n "${WWW_DOMAIN:-}" ] && [ "${WWW_DOMAIN}" != "${DOMAIN}" ]; then
    set -- "$@" -d "${WWW_DOMAIN}"
  fi
  if [ "${CERTBOT_STAGING:-0}" = "1" ]; then
    set -- "$@" --staging
  fi
  "$@"
}

certificate_manager() {
  if [ ! -s "${LIVE_DIR}/fullchain.pem" ] || [ ! -s "${LIVE_DIR}/privkey.pem" ]; then
    until request_certificate; do
      echo "Certificate request failed; retrying in 5 minutes."
      sleep 300
    done
    use_live_certificate
    render_nginx
    nginx -s reload
  fi

  while sleep 43200; do
    certbot renew --webroot -w "${CERTBOT_WEBROOT}" --quiet || true
    nginx -s reload
  done
}

if [ -s "${LIVE_DIR}/fullchain.pem" ] && [ -s "${LIVE_DIR}/privkey.pem" ]; then
  use_live_certificate
else
  use_bootstrap_certificate
fi

render_nginx
nginx -g 'daemon off;' &
NGINX_PID=$!

certificate_manager &
CERTBOT_PID=$!

shutdown() {
  kill -TERM "${CERTBOT_PID}" 2>/dev/null || true
  kill -QUIT "${NGINX_PID}" 2>/dev/null || true
  wait "${NGINX_PID}" 2>/dev/null || true
}

trap shutdown INT TERM
wait "${NGINX_PID}"
