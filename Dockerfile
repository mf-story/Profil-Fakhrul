# Menyajikan situs statis dengan Nginx (untuk Coolify / Docker)
FROM nginx:alpine

# Konfigurasi Nginx (gzip + cache)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin seluruh berkas situs ke folder web Nginx
COPY . /usr/share/nginx/html

# Bersihkan berkas yang tidak perlu disajikan
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/serve.ps1

EXPOSE 80
