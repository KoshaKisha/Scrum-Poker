# 🧩 Scrum Poker App (Next.js + Prisma + PostgreSQL)

> Веб-приложение для планирования задач по методу Scrum Poker.

## ⚙️ Технологии

* [Next.js 14 (App Router)](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Prisma ORM](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [JWT](https://jwt.io/)
* [Lucide Icons](https://lucide.dev/)
* [ShadCN/UI](https://ui.shadcn.com/)

---

## 🚀 Быстрый старт

### 1. Клонировать проект

```bash
git clone https://github.com/твой-проект-url.git
cd scrum-poker
```

### 2. Установить зависимости

```bash
pnpm install
```

или если не установлен `pnpm`:

```bash
npm install -g pnpm
pnpm install
```

> Убедись, что у тебя локально установлен и запущен PostgreSQL. Пример команды для создания БД:
>
> ```bash
> createdb mydb
> ```

---

### 3. Настройка Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### 4. Запуск проекта

```bash
pnpm dev
```

Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

---

## 📁 Структура проекта

```
app/                    - App Router
├── api/                - API routes (login, register, rooms)
├── dashboard/          - Главная страница после входа
├── rooms/              - Интерфейс взаимодействия с комнатами

lib/
├── auth/               - Функции авторизации клиента
├── server/auth/        - Серверная логика авторизации
├── rooms.ts            - Логика работы с комнатами

prisma/
├── schema.prisma       - Схема базы данных

components/
├── ui/                 - Компоненты интерфейса
├── room-card.tsx       - Компонент карточки комнаты

hooks/
├── use-auth.ts         - React-контекст аутентификации

```

---

## 📌 Зависимости

Убедись, что установлено:

* **Node.js** `>= 18`
* **pnpm** `>= 8` (или `npm/yarn`)
* **PostgreSQL** `>= 14`
* **Git** (для клонирования и деплоя)

---

## 🧪 Доп. команды

```bash
# Применить миграции
npx prisma migrate dev

# Открыть Prisma Studio (GUI для БД)
npx prisma studio
```

---

## 🧩 TODO / В разработке

* [x] Аутентификация (JWT, cookie)
* [x] Комнаты
* [x] Голосование
* [ ] Приглашения по ссылке
* [ ] Live-обновления через WebSocket
* [ ] Поддержка mobile UI

---


