FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine

RUN apk add --no-cache certbot gettext openssl

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf.template /etc/nginx/templates/site.conf.template
COPY docker/https-entrypoint.sh /usr/local/bin/https-entrypoint.sh
RUN chmod +x /usr/local/bin/https-entrypoint.sh \
    && rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80 443
VOLUME ["/etc/letsencrypt", "/var/www/certbot"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1

ENTRYPOINT ["/usr/local/bin/https-entrypoint.sh"]
