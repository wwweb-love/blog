
local: http://localhost:3000
VPS: http://46.229.212.69:3000/
-------------------------------------------NODE_JS

cd ./backend
npm run dev 

-------------------------------------------DOCKER

Надо создать docker-compose.yml, который позволит запустить несколько приложений (Node JS, MongoDB)
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret123
      MONGO_INITDB_DATABASE: mydb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    container_name: backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      - DB_CONNECTION_STRING=mongodb://admin:secret123@mongodb:27017/mydb?authSource=admin
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongodb_data:

Создать Dockerfile и прописать конфигурацию 
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

Использовать .env для скрытия важных ключей
DB_CONNECTION_STRING=mongodb://admin:secret123@mongodb:27017/mydb?authSource=admin
JWT_SECRET=testtest
Использовать их в server.js и других файлах
require(“dotenv”).config()
process.env.DB_CONNECTION_STRING
Команда для запуска Docker 
# Остановить старые контейнеры если есть
Docker-compose down
# Собрать и запустить
Docker-compose up –build
# Для фонового режима
Docker-compose up -d –build
# Посмотреть логи
Docker-compose logs -f 
