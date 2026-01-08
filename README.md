🏪 NK Enterprise  Management System

A web-based Provision Shop Management System designed to help shop owners efficiently manage products, sales, suppliers, and inventory in a simple and secure way.
This system replaces manual record-keeping with a modern digital solution, improving accuracy, speed, and decision-making.

📌 Project Overview

The Provision Shop Management System is built to automate the daily operations of a retail provision shop.
It allows authenticated users to manage stock levels, record sales, track suppliers, and monitor low-stock items in real time.

The system includes authentication and role-based access, ensuring that only authorized users can access sensitive data.

🚀 Features

🔐 User Authentication

Secure login system

Protected dashboard access

Session persistence using local storage

📦 Product Management

Add, edit, and delete products

View product details and categories

💰 Sales Management

Record daily sales

Track sold items and quantities

🚚 Supplier Management

Manage supplier details

Link suppliers to products

📉 Low Stock Monitoring

Automatic detection of low-stock items

Helps prevent out-of-stock situations

⚙️ Settings Management

User and system configurations

📊 Dashboard Overview

Quick insights into shop activities

Centralized control panel

🛠️ Technologies Used
Frontend

React (TypeScript)

React Router DOM

Tailwind CSS

TanStack React Query

ShadCN UI

Lucide Icons

Backend

REST API

Authentication using JWT tokens

Secure API endpoints

Tools

Vite

Git & GitHub

Ngrok (for backend testing)

🔐 Authentication Flow

When the app starts:

Unauthenticated users are redirected to the Login page

Authenticated users are redirected to the Dashboard

Protected routes prevent unauthorized access

Tokens and user data are stored securely in local storage

📂 Project Structure
src/
├── components/
│   ├── layout/
│   ├── ui/
├── contexts/
│   ├── AuthContext.tsx
│   ├── SidebarContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Index.tsx
│   ├── Products.tsx
│   ├── Sales.tsx
│   ├── Suppliers.tsx
│   ├── LowStock.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── App.tsx
└── main.tsx

▶️ How to Run the Project

Clone the repository

git clone https://github.com/ruebeniosdev/stock-savvy


Navigate into the project folder

cd stock-savvy



Install dependencies

bun install


Start the development server

bun run dev


Open your browser and visit:

http://localhost:5173

🎯 System Objectives

Reduce manual errors in shop record-keeping

Improve inventory tracking

Enhance security through authentication

Increase efficiency in daily shop operations

📈 Future Enhancements

Sales reports and analytics

Barcode scanning support

Role-based access (Admin / Staff)

Printable receipts

Mobile-friendly version

👨‍💻 Author

Akankobateng Rueben
Computer Science Student
Provision Shop Management System – Academic Project

📜 License

This project is developed for educational purposes and is not intended for commercial use.