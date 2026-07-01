# 🛒 Marketplace Platform

A full-stack marketplace platform where users can buy and sell products, manage their profiles, exchange real-time messages and receive live notifications through a responsive, multilingual interface.

This project was developed as the final project for the **Advanced Java Programming (PAJ)** course during the **Java Fullstack Development Programme**.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Technical Highlights](#-technical-highlights)
- [Lessons Learned](#-lessons-learned)
- [Future Improvements](#-future-improvements)

---

# 📌 Overview

Marketplace Platform simulates a modern e-commerce platform where users can:

- Create an account
- Buy and sell products
- Search products by multiple criteria
- Contact sellers through real-time chat
- Receive live notifications
- Evaluate sellers
- Manage personal profiles
- Access an administration dashboard

Rather than being a simple CRUD application, the project focuses on building a complete full-stack solution with authentication, authorization, real-time communication and a scalable backend architecture.

---

# ✨ Core Features

## 👤 User Management

- User registration
- Email confirmation flow
- Secure authentication
- Password recovery
- Password reset
- Public user profiles
- Private dashboard
- Profile editing
- Role-based permissions
- Session management

---

## 🛍️ Marketplace

- Product publishing
- Product editing
- Product search
- Category filtering
- Location filtering
- Product status management
- Purchase workflow
- Seller profiles
- Seller evaluations

---

## 💬 Real-Time Communication

- One-to-one chat
- WebSocket communication
- Instant notifications
- Unread notification counter
- Live updates

---

## 📊 Administration

- Admin dashboard
- User statistics
- Product statistics
- Category management
- User management
- Product moderation

---

## 🌍 Internationalization

The application supports:

- 🇵🇹 Portuguese
- 🇬🇧 English
- 🇫🇷 French

using **react-intl**.

---

# 🛠 Technology Stack

## Backend

- Java 21
- Jakarta EE 10
- JAX-RS
- EJB
- JPA / Hibernate
- WebSockets
- BCrypt
- Log4j
- Maven
- JUnit
- Mockito

## Frontend

- React
- JavaScript
- React Router
- Zustand
- React Intl
- Bootstrap
- React Bootstrap
- Recharts

## Database

- PostgreSQL

## Server

- WildFly

# 🏗 Architecture

The project follows a layered full-stack architecture, separating presentation, business logic and persistence.

## Architecture at a Glance

```text
                          React Frontend
                                 │
                                 │
                    REST API + WebSockets
                                 │
                                 ▼
                   Jakarta EE Backend (WildFly)
                                 │
        ┌──────────────┬───────────────┬──────────────┐
        │              │               │              │
     Services       Business        WebSockets      Config
                     Beans
        │              │
        └──────────────┘
               │
              DAOs
               │
          JPA / Hibernate
               │
          PostgreSQL
```

### Backend Layers

The backend is organised into dedicated layers, each with a specific responsibility:

| Layer | Responsibility |
|-------|----------------|
| **Services** | Expose REST endpoints and handle HTTP requests/responses |
| **Beans** | Business logic and application rules |
| **DAOs** | Database access using JPA/Hibernate |
| **Entities** | Database model |
| **DTOs** | Data transfer between backend and frontend |
| **Exceptions** | Centralised exception handling |
| **WebSockets** | Real-time chat and notifications |
| **Utils / Config** | Shared utilities and application configuration |

This separation keeps the application modular, easier to maintain and easier to extend.

---

# 📂 Project Structure

```text
marketplace/
│
├── backend/
│   ├── bean/
│   ├── config/
│   ├── dao/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── init/
│   ├── service/
│   ├── util/
│   └── websocket/
│
├── proj5_frontend/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── stores/
│   ├── translations/
│   ├── utils/
│   └── websocket/
│
└── README.md
```

---

# 📸 Screenshots

## Home Page

![Home](assets/Homepage.png)

---

## Product Details

![Product](assets/Article.png)

---

## User Profile

![Profile](assets/Profile.png)

---

# 🚀 Installation

## Prerequisites

Before running the project make sure you have:

- Java 21
- Maven
- PostgreSQL
- WildFly
- Node.js
- npm

---

## Clone the repository

```bash
git clone https://github.com/dpassos91/marketplace.git
cd marketplace
```

---

## Backend

Navigate to the backend directory:

```bash
cd backend
```

Build the project:

```bash
mvn clean package
```

Deploy the generated WAR file to **WildFly**.

The backend expects a PostgreSQL datasource configured as:

```text
java:/postgresDS
```

The REST API will be available at:

```text
http://localhost:8080/diogopassos-proj5/rest
```

---

## Frontend

Navigate to the frontend directory:

```bash
cd proj5_frontend
```

Install the dependencies:

```bash
npm install
```

Run the application:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

---

# ⭐ Technical Highlights

Some of the most relevant technical aspects implemented throughout the project include:

### 🔐 Authentication & Security

- Secure password hashing with **BCrypt**
- Token-based session management
- Protected REST endpoints
- Role-based authorization
- Account confirmation workflow
- Password reset flow

---

### ⚡ Real-Time Communication

The application implements WebSockets to provide real-time communication between users.

Features include:

- Instant messaging
- Live notifications
- Product update broadcasts
- Unread notification counters
- Online user communication

---

### 📡 REST API

The backend exposes a RESTful API responsible for:

- Authentication
- User management
- Product management
- Categories
- Evaluations
- Dashboard statistics
- Messaging
- Notifications
- Settings

The API follows a layered architecture, separating business logic from persistence and presentation.

---

### 🗄 Persistence

Data persistence is implemented using:

- JPA
- Hibernate
- PostgreSQL

The application uses dedicated DAO classes to isolate database operations from business logic.

---

### 🌍 Internationalization

The frontend supports multiple languages through **react-intl**.

Currently available languages:

- Portuguese
- English
- French

---

### 📈 Dashboard

The administration dashboard includes:

- User statistics
- Product statistics
- Registration analytics
- Purchase analytics
- Category distribution
- Interactive charts

---

# 📚 Lessons Learned

This project was my first opportunity to build a complete full-stack application from scratch.

Throughout its development I significantly improved my understanding of:

- Designing layered software architectures
- Building REST APIs with Jakarta EE
- Applying object-oriented design principles
- Working with relational databases using JPA/Hibernate
- Integrating React with a Java backend
- Managing authentication and authorization
- Implementing real-time communication using WebSockets
- Structuring larger codebases into reusable components
- Managing application state with Zustand
- Internationalizing frontend applications

Beyond the technical skills, this project reinforced the importance of writing maintainable code, separating responsibilities and thinking about scalability from the beginning of development.

---

# 🔭 Future Improvements

Although the project already provides a complete marketplace experience, several improvements could be implemented in future versions:

- Docker support for simplified deployment
- CI/CD pipeline using GitHub Actions
- API documentation with OpenAPI / Swagger
- OAuth authentication (Google / Microsoft)
- Email service integration
- Payment gateway integration
- Shipping management
- Image upload to cloud storage
- Improved automated testing
- Performance optimizations
- Responsive UI refinements
- Containerized production deployment

---

# 👨‍💻 About This Project

This repository represents the culmination of my Java Full-Stack training and combines many of the concepts explored throughout the programme into a single application.

Rather than focusing solely on implementing CRUD operations, the goal was to build an application that resembles a real-world marketplace, integrating authentication, authorization, real-time communication, multilingual support and administrative features within a structured architecture.

It reflects not only the technologies I learned, but also my approach to software design, problem solving and continuous improvement.

---

## 📄 License

This project was developed for educational purposes as part of the **Java Fullstack Development Programme**.

Feel free to explore the code, provide feedback or get in touch if you'd like to discuss the project.

