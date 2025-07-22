# 🛒 E-Commerce Web Application

This repository was developed as part of the final project for the **Advanced Java Programming course (PAJ)**, in the 2nd trimester of the academic year 2024/2025.

## 📋 Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Features](#features)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)

## 🧠 Introduction

This fullstack e-commerce platform allows users to buy and sell products, interact via real-time messaging, and manage their profiles in a secure and responsive environment. The system was designed to simulate real-world application features such as email confirmation, password recovery, dashboards, notifications, and internationalization.

## 🛠️ Technologies Used

- **Backend:** Java EE (JAX-RS, EJBs), Jakarta, RESTful APIs  
- **Frontend:** React.js 
- **Database:** PostgreSQL with Hibernate (JPA)  
- **State Management:** Zustand  
- **Real-time Communication:** WebSockets  
- **Testing:** JUnit  
- **Internationalization:** react-intl (EN / FR / PT)  
- **Other:** JSON Web Tokens (JWT), Role-based Access Control, Logs

## 🖥️ Installation

To run the project locally:

1. Clone the repositories (frontend and backend in separate folders):
   ```bash
   git clone https://github.com/seu-utilizador/backend-projecto-final-paj.git
   git clone https://github.com/seu-utilizador/frontend-projecto-final-paj.git
   ```


2. Set up the **PostgreSQL** database and configure credentials in `application.properties`.

3. Navigate to the `/backend` folder and run the Spring Boot application.

4. Navigate to the `/frontend` folder and start the React app:
   ```bash
   npm install
   npm run dev
   ```

5. Open your browser and navigate to:
   - Frontend: https://localhost:3000  
   - Backend: http://localhost:8443  

> Ensure the PostgreSQL database is correctly connected.

## ✅ Features

- 📧 Email account confirmation on registration
- 🔐 Secure login with session timeout and access control
- 🔄 Password recovery via tokenized email link
- 👤 Public profile pages (e.g., /users/janedoe)
- 🛒 Product listing with categories, filters, and status updates
- 💬 Real-time 1-on-1 messaging between users
- 🔔 Notification system with real-time updates and counters
- 📈 Admin dashboard with graphs and statistics
- 🌍 Internationalization (EN / FR / PT) and responsive layout
- 📜 Logging of all critical actions (product updates, profile changes, etc.)

## 📸 Screenshots

Here is a preview of the application:

![Homepage Screenshot](assets/Homepage.png)  
![Profile Screenshot](assets/Profile.png)  
![Article Screenshot](assets/Article.png)  

## 🔭 Future Improvements

- 🧾 Product invoice and transaction history
- 🔗 Integration with third-party payment providers
- 📦 Shipping and delivery tracking
- 🧠 AI-powered product recommendations
- 🪪 OAuth-based login with Google or Microsoft

---

**Disclaimer:**  
This project was developed for educational purposes.
