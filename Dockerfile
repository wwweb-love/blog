FROM node:24

WORKDIR /usr/src/app

# Копируем package.json файлы для кеширования слоев
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Устанавливаем зависимости
WORKDIR /usr/src/app/frontend
RUN npm ci

WORKDIR /usr/src/app/backend
RUN npm ci

# Копируем весь код
WORKDIR /usr/src/app
COPY . .

# Собираем фронтенд
WORKDIR /usr/src/app/frontend
RUN npm run build

# Устанавливаем wait-for-it для ожидания БД
WORKDIR /usr/src/app/backend
RUN apt-get update && apt-get install -y wait-for-it && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

# Ждем MongoDB, затем запускаем
CMD wait-for-it mongodb:27017 -- node app.js