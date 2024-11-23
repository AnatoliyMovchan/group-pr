FROM node:16

# Робоча директорія
WORKDIR /app

# Копіюємо package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо весь проект
COPY . .

# Встановлюємо залежності з чистою компіляцією
RUN npm rebuild bcrypt --build-from-source

# Відкриваємо порт
EXPOSE 4000

# Запускаємо сервер
CMD ["npm", "start"]