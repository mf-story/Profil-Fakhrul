# Menjalankan situs + panel admin dengan Node.js
FROM node:20-alpine
WORKDIR /app

# Salin semua berkas aplikasi
COPY . .

# Data & unggahan disimpan di folder ini (pasang Persistent Storage di Coolify)
ENV PORT=80
EXPOSE 80

CMD ["node", "server.js"]
