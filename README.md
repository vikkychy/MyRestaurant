# MyRestaurant - System Guide

This guide describes the project as it exists in the repository, including implemented features, incomplete areas, and known defects. It is intended to give a developer or another coding assistant enough context to continue work safely.

## Project overview

MyRestaurant is a restaurant menu and ordering application built with a React/Vite frontend and an Express/MongoDB backend. Visitors can browse food, filter the menu, maintain a browser cart, and submit a delivery order. The backend also contains user authentication, admin-protected catalog/order/payment APIs, and database models for orders and payments.

The interface and checkout are tailored to Nepal: prices display as `Rs.`, phone numbers are checked as 10 digits beginning with `9`, and the backend stores the `+977` country prefix. Order placement currently supports Cash on Delivery (COD) only.

## Current implementation status

The repository has a single committed baseline (`394d657`, `Initial commit - MyRestaurant MERN project`). At the time this guide was written, the working tree also contained substantial uncommitted backend and frontend changes. Check `git status` before editing or resetting anything; those changes may represent active work.

There is no meaningful completion percentage to report. Several customer-facing screens and backend endpoints exist, but authentication and parts of the admin experience have a blocking defect, and payment provider integration is not implemented.

### Implemented in the source tree

- Responsive React pages for Home, Menu, Food Details, Cart, Checkout, Order Confirmation, and Admin Login.
- Menu and homepage data loaded from the API; menu search and category filtering.
- Cart state stored in `localStorage`, with quantity changes, item removal, and cart totals.
- Light/dark theme preference stored in `localStorage`.
- Guest checkout UI and an order creation endpoint. The server looks up current food prices and computes the order total instead of trusting submitted prices.
- MongoDB schemas and CRUD/read/update handlers for food and categories.
- Backend routes for register/login/logout, customer order/payment history, admin order/payment lists and status updates.
- JWT cookie creation, authentication middleware, and role authorization middleware are present in code.

### Critical known defect

`backend/models/userModel.js` currently defines and exports an **Order** schema/model, not a User schema/model. Authentication controllers and middleware import it as `User` and expect user fields and methods such as `name`, `email`, `password`, `role`, and `comparePassword`. Those operations therefore cannot work as intended.

There is also a separate `Order` model in `backend/models/orderModel.js`. Both files register the Mongoose model name `Order`, and `orderModel.js` reuses any model already registered under that name. Since the application imports the user routes before the order routes, the wrong schema may be registered first and reused for real orders. Repair the User model and model registration before relying on auth or order persistence.

## Technology and layout

### Stack

- Frontend: React 19, React Router, Axios, Lucide icons, Vite.
- Backend: Node.js ES modules, Express 5, Mongoose, MongoDB.
- Authentication: bcryptjs password hashing (expected by the original User schema), JWT, HTTP-only cookie, cookie-parser.
- Other backend dependencies include CORS, dotenv, validator, and Nodemailer. Nodemailer is not currently used by the application code.

### Repository map

```text
backend/
  app.js                    Express middleware, CORS, route mounting, health endpoint
  server.js                 Loads config, connects MongoDB, starts HTTP server
  config/db.js              Mongoose connection
  config/config.env         Local secrets/config (ignored by Git; do not commit)
  controllers/              Request handlers for users, food, categories, orders, payments
  middlewares/authMiddleware.js
  models/                   Mongoose models for User, Food, Category, Order, Payment
  routes/                   API route definitions and access control
  utils/jwtToken.js         JWT signing and cookie settings
frontend/
  src/App.jsx               Client-side route table
  src/Pages/                Page components and page styles
  src/components/Navbar.jsx Shared navigation
  src/context/              Cart and theme React contexts
  src/services/api.js       Shared Axios client
  src/index.css             Global styles/theme variables
```

The root `README.md` is the main system guide. `frontend/README.md` is still the Vite starter document and does not describe the restaurant application.

## Local setup

Install a Node.js version compatible with the dependency versions in the package files, plus access to a MongoDB instance.

1. Create `backend/config/config.env` (this file is ignored by Git) with the required settings:

   ```dotenv
   PORT=5000
   HOST=127.0.0.1
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/myrestaurant
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7
   ```

   `MONGO_URI` is needed to start the backend. JWT settings are needed for authentication. Never commit real secrets. `server.js` loads `./config/config.env` relative to the backend process working directory, so start backend commands from `backend/`.

2. Install backend dependencies and start the API:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   `npm start` runs the same server without nodemon.

3. In a second terminal, install frontend dependencies and start Vite:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend API client currently targets `http://127.0.0.1:5000/api/v1`. The backend CORS allow-list currently includes `http://localhost:5173` and `http://127.0.0.1:5173`.

4. Check API availability at `http://127.0.0.1:5000/api/health`.

### Available package scripts

| Package | Command | Purpose |
| --- | --- | --- |
| backend | `npm run dev` | Start API with nodemon |
| backend | `npm start` | Start API |
| frontend | `npm run dev` | Start Vite development server |
| frontend | `npm run build` | Create production frontend bundle |
| frontend | `npm run lint` | Run ESLint |
| frontend | `npm run preview` | Preview a built frontend bundle |

There is no test script or test suite in the current package manifests.

## Frontend behavior

### Routes

| Path | Page | Current behavior / state |
| --- | --- | --- |
| `/` | Home | Shows hero content, categories, and up to four available foods from API data. |
| `/menu` | Menu | Loads foods/categories; searches food names and filters by active category. |
| `/food/:id` | Food Details | Loads one food item; intended entry point for adding it to the cart. |
| `/cart` | Cart | Shows persisted cart, quantity controls, removal, clear, and subtotal. |
| `/checkout` | Checkout | Collects delivery details and submits a COD order as a guest. |
| `/order-confirmation` | Order Confirmation | Displays the just-created order from router state; a direct visit/reload redirects to `/menu`. |
| `/login` | Admin Login | Attempts login and navigates to `/admin/orders` for admin roles. |
| `/about`, `/contact` | Placeholder | Routes currently render empty `<div>` elements. |

`/admin/orders` is not registered in `App.jsx`, so the successful admin login destination has no implemented page. There are no frontend registration, customer account, order-history, menu-admin, order-admin, or payment-admin screens in the current route table.

### State and API client

- `CartContext` persists cart data under `myrestaurant-cart` in local storage. Prices and names are snapshots for display; the backend re-fetches each food item and recomputes prices at checkout.
- `ThemeContext` persists `light` or `dark` under `myrestaurant-theme` and writes it to the document root as `data-theme`.
- `frontend/src/services/api.js` uses a fixed localhost API URL and `withCredentials: true` for cookie requests. The API URL should become environment-configurable before deployment.
- The frontend has no general authentication/session context. Login is only presented as Admin Login.

## Backend API

All application routes are mounted below `/api/v1`. Unless marked otherwise, request and response bodies are JSON. Admin routes require a valid auth cookie and role `admin` or `superadmin`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | API health check (outside `/api/v1`). |
| POST | `/api/v1/users/register` | Public | Register account. No registration page exists in frontend. |
| POST | `/api/v1/users/login` | Public | Verify credentials and set JWT cookie. |
| POST | `/api/v1/users/logout` | Public | Clear JWT cookie. |
| GET | `/api/v1/users/me` | Authenticated | Return current user. |
| GET | `/api/v1/categories` | Public | List categories. |
| POST | `/api/v1/categories` | Admin | Create category. |
| PUT | `/api/v1/categories/:id` | Admin | Update category. |
| DELETE | `/api/v1/categories/:id` | Admin | Delete category. |
| GET | `/api/v1/foods` | Public | List foods with populated category names. |
| GET | `/api/v1/foods/:id` | Public | Get one food item. |
| POST | `/api/v1/foods` | Admin | Create food item. |
| PUT | `/api/v1/foods/:id` | Admin | Update food item. |
| DELETE | `/api/v1/foods/:id` | Admin | Delete food item. |
| POST | `/api/v1/orders/new` | Public | Create guest order; only COD currently accepted. |
| GET | `/api/v1/orders/myorders` | Authenticated | List orders associated with current user. |
| GET | `/api/v1/orders/admin/orders` | Admin | List all orders. |
| PUT | `/api/v1/orders/admin/orders/:id` | Admin | Update order status. |
| GET | `/api/v1/payments/my-payments` | Authenticated | List current user's payment records. |
| GET | `/api/v1/payments/admin/payments` | Admin | List all payment records. |
| PUT | `/api/v1/payments/admin/payments/:id` | Admin | Manually update payment status. |

Order status values: `Pending`, `Confirmed`, `Preparing`, `Ready`, `Delivered`, `Cancelled`.

Payment status values: `Pending`, `Paid`, `Failed`, `Refunded`.

Payment method schema values: `COD`, `eSewa`, `Khalti`; order creation rejects any method other than COD. There is no gateway integration, transaction verification, webhook, or payment UI.

## Data model overview

- **User** - intended fields are name, unique email, phone, password hash, and role (`customer`, `admin`, `superadmin`). The current `userModel.js` defect described above prevents this intended model from being used correctly.
- **Category** - unique name, optional description, `isActive`, timestamps.
- **Food** - name, description, non-negative price, Category reference, optional image `{ public_id, url }`, `isAvailable`, timestamps.
- **Order** - optional customer reference, customer name/email, item snapshots (Food ref, name, price, quantity), server-computed total, delivery address, phone, payment method/status, order status, timestamps.
- **Payment** - unique Order reference, optional customer reference, amount, payment method/status, optional transaction ID, timestamps.

The backend creates a Payment record when it creates an order. Guest orders have a null customer reference. Although the order handler contains optional logic to use `req.user`, the POST route does not attach authentication middleware, so requests through the current route are treated as guest orders. Consequently, `myorders` and `my-payments` will not find those guest records.

## Remaining work and recommended order

### P0 - Repair correctness blockers

1. Restore `backend/models/userModel.js` as the actual User model, including password hashing/comparison and intended role fields. Ensure it registers a model named `User`.
2. Keep `Order` registration exclusively in `orderModel.js` and make sure its schema matches `createOrder` (including guest customer and customer name/email fields). Avoid reusing a model name registered with another schema.
3. After the model repair, exercise register, login, `/users/me`, logout, guest checkout, order persistence, and admin authorization against MongoDB.

### P1 - Complete user-facing workflows

1. Implement the admin orders page at `/admin/orders`, or change the login destination to a route that exists. Add admin screens for catalog CRUD and payment/order management if admin operations are meant to be performed through this app.
2. Decide the account model: guest-only ordering, or customer registration/login and linked order history. If customer accounts are supported, protect or explicitly associate the checkout order and payment records with the authenticated user.
3. Implement eSewa/Khalti payment flows if required. Until then, keep the UI and API contract clearly COD-only; do not mark a payment paid without verified payment evidence.
4. Make the order confirmation recoverable from the backend rather than only router state, so refreshes and later visits can display an order safely.

### P2 - Finish product and deployment readiness

1. Add environment-based frontend API URL and configurable backend CORS origins; define a production deployment setup.
2. Add food image upload/management. The schema has image metadata fields, but current create/update handlers do not accept or upload images.
3. Complete About and Contact pages, and add not-found/loading/error states where needed.
4. Add validation and safeguards for deleting categories referenced by foods, order/payment status transitions, duplicate checkout submissions, and consistency between related records. Order and Payment updates currently use separate writes rather than a database transaction.
5. Add automated backend/frontend tests and document a repeatable verification procedure. Current manifests have no test scripts.
6. Review accessibility, production cookie/CORS settings, error responses, logging, and deployment configuration.

These are recommendations based on the current source, not a claim that each item is part of the original product requirements.

## Notes for future coding assistants

- Read this file, then inspect `git status` and the relevant source files before changing anything. The current implementation has uncommitted work.
- Treat the P0 model issue as unresolved until verified in code and with a database-backed check.
- Do not assume the frontend route implies a backend feature is finished, or vice versa; admin APIs exist without their corresponding screens.
- The ignored `backend/config/config.env` may contain private credentials. Do not print, copy into docs, or commit its contents. Use placeholders in examples.
- No automated tests were run while writing this guide.
