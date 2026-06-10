# CLAUDE.md
This file provides guidance to Claude Code when working on the Furniture Admin Frontend.
# Project Overview
This project is the Admin Dashboard for a Furniture E-Commerce Platform.
The admin panel allows administrators to:
* View business analytics
* Manage product categories
* Manage products
* Manage customer orders
* Monitor platform performance
The frontend communicates with a NestJS backend through REST APIs.
# Tech Stack
Frontend:
* Next.js 15 (App Router)
React 19
* TypeScript
* Tailwind CSS
* Shadcn UI
* React Router
* React Query (TanStack Query)
* Axios
* React Hook Form
* Zod Validation
* Recharts
Backend:
* NestJS
* PostgreSQL
* JWT Authentication
* REST API
# Development Rules
## UI First Approach
Before integrating APIs:
1. Build complete UI
2. Create reusable components
3. Add form validation
4. Add loading states
5. Add empty states
6. Add error states
7. Integrate backend APIs
Always maintain production-level UI quality.
# Admin Layout
Admin dashboard contains:
## Analytics
### Overview Analytics
Display:
* Total Revenue
* Total Orders
* Total Products
* Total Categories
* Total Customers
* Pending Orders
* Completed Orders
Widgets:
* Revenue Card
* Orders Card
* Products Card
* Categories Card
Charts:
* Revenue Trend
* Orders Trend
* Monthly Sales
---
### Sales Analytics
Display:
* Daily Sales
* Weekly Sales
* Monthly Sales
* Yearly Sales
Charts:
* Sales Growth
* Revenue Chart
* Orders Chart
Tables:
* Top Selling Products
* Recent Orders
---
### Product Analytics
Display:
* Total Products
* Active Products
* Out of Stock Products
* Low Stock Products
Charts:
* Product Performance
* Stock Distribution
Tables:
* Best Selling Products
* Low Stock Products
---
# Category Management
Admin can:
* Create Category
* View Categories
* Update Category
* Delete Category
Category Fields:
* Name
* Slug
* Description
* Image
* Status
Pages:
### Category List
Features:
* Search
* Pagination
* Sorting
* Filter
* Status Badge
Actions:
* Edit
* Delete
* View
### Create Category
Form:
* Category Name
* Description
* Image Upload
* Status
### Edit Category
Pre-filled form data.
---
# Product Management
Admin can:
* Create Product
* View Products
* Update Product
* Delete Product
Product Fields:
* Name
* Slug
* Description
* Category
* Price
* Discount Price
* SKU
* Stock Quantity
* Material
* Color
* Dimensions
* Weight
* Images
* Status
Pages:
### Product List
Features:
* Search
* Filter
* Pagination
* Sorting
Actions:
* Edit
* Delete
* View
### Create Product
Form validation required.
### Edit Product
Pre-filled form.
### Product Details
Display:
* Images
* Product Information
* Stock Status
* Pricing Information
---
# Order Management
Admin can:
* View Orders
* View Order Details
* Update Order Status
Order Statuses:
* Pending
* Confirmed
* Processing
* Shipped
* Delivered
* Cancelled
--
## Order List
Display:
* Order ID
* Customer Name
* Total Amount
* Payment Method
* Order Status
* Order Date
Features:
* Search
* Filter
* Pagination
Actions
* View Details
* Change Status
---
## Order Details
Display:
### Customer Information
* Name
* Email
* Phone
### Shipping Address
* Address
* City
* State
* Pincode
### Ordered Products
* Product Image
* username Image
* user phone number
* Product Name
* Quantity
* Price
### Order Summary
* Subtotal
* Shipping Charge
* Tax
* Total Amount
---
# API Integration Rules
## API Layer
Create separate API service files.
Example:
services/
├── analytics.api.ts
├── category.api.ts
├── product.api.ts
├── order.api.ts
Never call APIs directly inside components.
---
## React Query
Use:
* useQuery
* useMutation
* query invalidation
for all server communication.
---
## Error Handling
Handle:
* 400 Validation Errors
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 500 Internal Server Error
Show user-friendly messages.
---
## Loading States
Every page must have:
* Skeleton Loader
* Spinner
* Empty State
Never leave blank screens.
---
# Component Structure
components/

analytics/
category/
product/
order/
layout/
common/
Reusable Components:
* DataTable
* SearchInput
* StatusBadge
* ConfirmationModal
* Pagination
* ImageUploader
* EmptyState
* LoadingSkeleton
---
# Form Rules
Use:
* React Hook Form
* Zod Validation
Validation:
* Required Fields
* Min Length
* Max Length
* Numeric Validation
Show validation errors below fields.
---
# Design Rules
* Responsive Design
* Mobile Friendly
* Clean Admin UI
* Consistent Spacing
* Accessible Components
* Reusable Components
Prefer reusable components over duplicated code.
---
# Code Quality Rules
Always:
* Use TypeScript
* Use Interfaces
* Create reusable hooks
* Follow feature-based folder structure
* Keep components small
* Avoid code duplication
---
# Expected Admin Navigation
Dashboard
├── Analytics
│   ├── Overview
│   ├── Sales
│   └── Products
├── Categories
│   ├── List
│   ├── Create
│   └── Edit
├── Products
│   ├── List
│   ├── Create
│   ├── Edit
│   └── Details
└── Orders
├── List
└── Details
---
# Goal
Build a production-ready Furniture Admin Dashboard with:
* Professional UI
* Reusable Components
* Scalable Architecture
* Complete CRUD Operations
* Analytics Visualization
* Order Status Management
* Clean API Integration
* Responsive Design
