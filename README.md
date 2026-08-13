# 🛒 ShopMate AI-Integrated Ecommerce Website

A full-stack e-commerce web application built with **React, Vite, Node.js, Express, and PostgreSQL**, with AI-powered product assistance and a dedicated admin dashboard.

## ✨ Features

### 🛍️ Customer
- Product browsing, categories, search, pagination
- Product details and reviews
- Shopping cart and quantity management
- Authentication and user profiles
- Address management
- Orders and order history
- Stripe payment integration
- Responsive UI and theme support

### 🤖 AI
- AI-powered product search
- AI-assisted product recommendations
- Groq API integration

### 👨‍💼 Admin
- Protected admin dashboard
- Store statistics
- Product management
- Customer management
- Order management
- Revenue and order-status charts
- Admin profile management

### 🔐 Backend
- JWT authentication
- Protected routes
- Password reset and email support
- Centralized error handling
- Environment-based configuration

### ☁️ Services
- **Cloudinary** — image storage
- **Stripe** — payments
- **Groq** — AI features
- **Gmail SMTP** — email functionality

## 🧰 Tech Stack

**Frontend:** React, Vite, React Router, Redux Toolkit, Tailwind CSS, Axios, Lucide React

**Backend:** Node.js, Express.js, PostgreSQL, JWT, Stripe, Groq API, Cloudinary, SMTP

**Tools:** Git, GitHub, ESLint, PostCSS

## 📁 Project Structure

```text
ShopMate/
├── frontend/
│   ├── public/
│   └── src/
│       ├── admin/
│       ├── components/
│       ├── contexts/
│       ├── layouts/
│       ├── pages/
│       └── store/
├── server/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── router/
│   └── utils/
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Clone

```bash
git clone https://github.com/Abdullah-biiu/ShopMate.git
cd ShopMate
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

### Backend

Open another terminal:

```bash
cd server
npm install
npm start
```

The backend uses the `PORT` configured in the environment file.

## 🔐 Environment Variables

Create:

```text
server/config/config.env
```

Use your own credentials:

```env
PORT=4000

FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174

JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
JWT_SECRET_KEY=your_jwt_secret

SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

GROQ_API_KEY=your_groq_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_FRONTEND_KEY=your_stripe_publishable_key

DB_USER=postgres
DB_HOST=localhost
DB_NAME=mern_ecommerce_store
DB_PASSWORD=your_database_password
DB_PORT=5432
```

> **Never commit real API keys, passwords, database credentials, JWT secrets, Stripe secrets, or email passwords to GitHub.**

## 🗄️ Database

ShopMate uses **PostgreSQL**.

Make sure PostgreSQL is installed and running, and create the database configured in your environment file:

```text
mern_ecommerce_store
```

## 💳 Stripe Payments

Stripe is used for payment processing. Configure your Stripe secret, webhook, and publishable keys in `config.env`.

Never expose the Stripe secret key in frontend code.

## 🤖 Groq AI

Groq powers the AI-related shopping features. Configure:

```env
GROQ_API_KEY=your_groq_api_key
```

## ☁️ Cloudinary

Configure your Cloudinary credentials in `config.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📸 Screenshots

You can add screenshots later:

```md
![Home Page](screenshots/home.png)
![Products Page](screenshots/products.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
![Cart](screenshots/cart.png)
```

## 🔒 GitHub Safety

The repository excludes sensitive and unnecessary files such as:

- `node_modules/`
- `config.env`
- `.env`
- build output
- log files
- temporary uploaded files

## 🎯 Future Improvements

- Wishlist
- Advanced filtering and sorting
- Enhanced AI shopping assistant
- Improved recommendations
- Order tracking
- Automated testing
- Production deployment
- Advanced analytics

## 👨‍💻 Author

**Abdullah Ahmad**

GitHub: https://github.com/Abdullah-biiu

⭐ If you like the project, consider giving it a star!
