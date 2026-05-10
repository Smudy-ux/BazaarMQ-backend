# BazaarMQ

A microservices-based e-commerce platform built with Node.js, Express, MongoDB, and RabbitMQ. This project demonstrates an event-driven architecture using an API Gateway pattern with asynchronous message queuing for order processing.

## Deployment

Currently running on AWS EC2

## Roadmap

Frontend application is planned to be developed and will integrate with these backend services to provide a complete e-commerce experience

## Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │──────▶ API Gateway │      │   MongoDB   │
└─────────────┘      │   (3000)    │      └─────────────┘
                     └──────┬──────┘                 ▲
                            │                        │ 
           ┌────────────────┼────────────────┐       │
           │                │                │       │
           ▼                ▼                ▼       │
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
    │    Auth     │  │   Product   │  │    Order    ││
    │  (3001)     │  │  (3002)     │  │  (3003)     ││
    │             │  │             │  │             ││
    │ • Register  │  │ • Create    │  │ • Create    ││
    │ • Login     │  │ • List      │  │ • Publish   ││
    │ • Logout    │  │ • Stock     │  │   to Queue  ││
    │ • JWT Auth  │  │   Check     │  │             ││
    └─────────────┘  └─────────────┘  └──────┬──────┘│
                                             │       │
                                             │       │
                                             ▼       │
                                     ┌─────────────┐ │
                                     │   RabbitMQ  │ │
                                     │    Queue    │ ┘
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │   Product   │
                                     │   Service   │
                                     │(Stock Deduct│
                                     │  Consumer)  │
                                     └─────────────┘
```


## Services

### API Gateway (`/services/api-gateway`)

**Port**: 3000

**Purpose**: Single entry point for all client requests, routes to appropriate microservices

**Tech**: Express, http-proxy-middleware, CORS

**Routes**:
`/api/auth/*` → Auth Service (3001)
`/api/products/*` → Product Service (3002)
`/api/order/*` → Order Service (3003)

### Auth Service (`/services/auth-service`)

**Port**: 3001

**Purpose**: User authentication and authorization

**Tech**: Express, MongoDB, Mongoose, JWT, bcrypt, cookie-parser

**Features**:
User registration with password hashing
JWT-based login with access and refresh tokens
HTTP-only cookie-based token storage
Token refresh endpoint
Logout with token cleanup

**Routes**:
`POST /api/auth/register` - Create new user
`POST /api/auth/login` - Authenticate user
`POST /api/auth/logout` - Clear session
`POST /api/refresh` - Refresh access token

### Product Service (`/services/product-service`)

**Port**: 3002

**Purpose**: Product catalog and inventory management

**Tech**: Express, MongoDB, Mongoose, JWT auth middleware

**Features**:
Create products (authenticated)
List all products
Check product stock levels
RabbitMQ consumer for stock deduction

**Routes**:
`POST /api/products/create` - Create product (protected)
`GET /api/products` - List all products
`GET /api/products/:id/stock` - Get stock for product

### Order Service (`/services/order-service`)

**Port**: 3003

**Purpose**: Order creation and processing

**Tech**: Express, MongoDB, Mongoose, RabbitMQ (amqplib)

**Features**:
Create orders with stock validation
Publishes orders to RabbitMQ queue
Persists orders to database

**Routes**:
`POST /api/order/create-order` - Create new order (protected)

## Event Flow

When an order is created:

1. **Order Service** validates stock by calling Product Service via API Gateway
2. If sufficient stock, **Order Service** publishes message to `order.created` RabbitMQ queue
3. **Order Service** consumer saves order to MongoDB
4. **Product Service** consumer receives message and deducts stock from inventory

## The .env files for each microservice

### Local Development

Each service has its own `.env` file:

```env
# services/auth-service/.env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/auth
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-refresh-secret

# services/product-service/.env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/products
ACCESS_TOKEN_SECRET=your-secret
AMQP_URL=amqp://localhost

# services/order-service/.env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/orders
ACCESS_TOKEN_SECRET=your-secret
AMQP_URL=amqp://localhost
```
## API Endpoints

| Service | Method | Endpoint | Description | Auth |
|---------|--------|----------|-------------|------|
| Gateway | Any | `/api/auth/*` | Proxies to Auth Service | No |
| Gateway | Any | `/api/products/*` | Proxies to Product Service | No |
| Gateway | Any | `/api/order/*` | Proxies to Order Service | No |
| Auth | POST | `/api/auth/register` | Create new user | No |
| Auth | POST | `/api/auth/login` | Login user | No |
| Auth | POST | `/api/auth/logout` | Logout user | Yes |
| Auth | POST | `/api/refresh` | Refresh access token | Yes |
| Product | POST | `/api/products/create` | Create product | Yes |
| Product | GET | `/api/products` | List all products | No |
| Product | GET | `/api/products/:id/stock` | Get product stock | No |
| Order | POST | `/api/order/create-order` | Create order | Yes |

## Technologies

**Runtime**: Node.js 18+

**Framework**: Express.js

**Database**: MongoDB with Mongoose ODM

**Message Broker**: RabbitMQ (amqplib)

**Authentication**: JWT with HTTP-only cookies

**Security**: bcrypt for password hashing, CORS

**Containerization**: Docker, Docker Compose

**Development**: Nodemon for hot reload