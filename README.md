# eCommerce Website

This is a full-fledged eCommerce platform built with Node.js, Express.js, Prisma, and MongoDB. The application provides an easy-to-use interface for users to browse, search, and purchase products. Administrators can manage everything from product listings, reviews, offers, and coupon codes to transaction history.

## Features

### User Features:

-   **User Registration & Authentication:** Users can sign up, log in, and access their profiles securely.
-   **Product Browsing:** Users can view a variety of products with detailed descriptions, images, and prices.
-   **Search & Filters:** Users can search products by name, category, or filter by various attributes like price, brand, and more.
-   **Add to Cart & Checkout:** Users can add products to their cart and proceed with checkout securely.
-   **Order Placement:** Users must be authorized to place an order. This ensures secure transactions.
-   **Order History:** Users can view their previous orders and track the status of current orders.

### Admin Features:

-   **Product Management:** Admins can add, update, and delete products from the database.
-   **Review Management:** Admins can manage product reviews, including deleting inappropriate reviews.
-   **Offer & Coupon Management:** Admins can create, update, and delete discount offers and coupon codes.
-   **Transaction Management:** Admins can view and manage all transactions on the platform.
-   **Order Management:** Admins can view, update, or delete customer orders.
-   **User Management:** Admins can manage user accounts and view activity.

## Tech Stack

-   **Frontend:** NextJs, ReactJs, Redux Toolkit, RTK Query

    -   **Frontend Live Link:** https://gadget-galaxy-smoky.vercel.app
    -   **Frontend GitHub Link:** https://github.com/NiharMondal/nextjs-ecommerce

-   **Backend:**
    -   **Node.js:** JavaScript runtime environment
    -   **Express.js:** Web framework for Node.js
    -   **Prisma:** ORM for database interaction
    -   **MongoDB:** NoSQL database for storing product, user, and transaction data
-   **Authentication:** JWT (JSON Web Tokens) for secure user authentication

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/NiharMondal/gadget-galaxy-backend
    ```

2. Navigate to the project directory:

    ```bash
    cd gadget-galaxy-backend
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up your MongoDB connection:

-   Create a .env file in the root directory and add your MongoDB URI:

    ```env
    PORT = 5000
    DATABASE_URL = "your mongodb database url"

    SALT_ROUND = 12
    JWT_SECTET = jwt_secret
    JWT_EXPIRES = "3d"

    # Cloudinary
    CLOUD_NAME = "your cloudinary cloud name"
    API_KEY = api key #number
    API_SECRET = api secret

    # for payment
    STRIPE_API_KEY = "strip key"

    DOMAIN_URL = "http://localhost:3000" #front-end url
    NODE_ENV = "development"

    # this two field is used for sending email to rest password
    EMAIL = "your email"
    PASSWORD = "password"
    ```

4. Run the application:
    ```
    npm run dev
    ```

Access the app at http://localhost:5000 in your browser.
