# VendorBridge - Procurement & Vendor Management ERP

A complete, production-ready Procurement & Vendor Management ERP system built with modern technologies.

## Overview

VendorBridge streamlines the procurement workflow:
- Procurement Officers create RFQs
- Vendors submit quotations
- Procurement compares and scores quotations
- Managers approve/reject
- Automatic PO and Invoice generation
- Real-time notifications and activity logging

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Shadcn UI
- TanStack Query
- React Hook Form
- Zod
- Recharts

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM

### Infrastructure
- Docker & Docker Compose
- MinIO (S3-compatible storage)
- Nginx
- GitHub Actions CI/CD

### Features
- JWT Authentication with Refresh Tokens
- Role-Based Access Control (RBAC)
- Real-time notifications (Socket.IO)
- PDF generation (PDFKit)
- Email notifications (Nodemailer)
- Comprehensive audit logging
- Advanced reporting & analytics

## Project Structure

```
vendorbridge/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # NestJS application
├── packages/
│   ├── ui/               # Shared UI components
│   ├── shared/           # Shared utilities
│   └── types/            # Shared TypeScript types
├── infrastructure/
│   ├── docker/           # Docker configurations
│   └── nginx/            # Nginx configuration
├── docs/                 # Documentation
└── docker-compose.yml    # Complete stack orchestration
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL (handled by Docker)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Kris832/vendorbridge.git
cd vendorbridge

# Start the entire stack
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Swagger Docs: http://localhost:3001/api/docs
```

### Local Development

```bash
# Install dependencies
npm install

# Build packages
npm run build

# Start development servers
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

## User Roles

- **Admin** - System administration, user management
- **Procurement Officer** - RFQ creation, vendor management
- **Vendor** - Quotation submission, document management
- **Manager/Approver** - RFQ/PO approval workflow

## Default Credentials

```
Admin Email: admin@vendorbridge.com
Admin Password: Admin@123456

Procurement Officer: procure@vendorbridge.com
Procurement Password: Procure@123456

Manager: manager@vendorbridge.com
Manager Password: Manager@123456

Vendor: vendor@example.com
Vendor Password: Vendor@123456
```

## Features

### Authentication
- User registration and login
- Email verification
- Password reset
- JWT with refresh tokens
- RBAC implementation

### Dashboard
- Real-time analytics
- Spending charts
- Procurement metrics
- KPI cards

### Vendor Management
- Complete vendor CRUD
- GST/Tax details
- Contact management
- Document uploads
- Vendor ratings

### RFQ Management
- RFQ creation with product lines
- Automatic numbering
- Vendor assignment
- Deadline tracking
- Document attachments

### Quotation Management
- Vendor quotation submission
- Price and tax calculations
- Delivery timeline tracking
- Side-by-side comparison

### Scoring Engine
- Vendor scoring: Price (50%), Delivery (30%), Rating (20%)
- Automated ranking

### Approval Workflow
- Draft → Submitted → Under Review → Approved/Rejected → PO Generated → Invoice Generated

### Purchase Orders & Invoices
- Auto-generated PDF documents
- Email delivery
- Tax calculations
- Print support

### Notifications
- Real-time socket.io notifications
- Email notifications
- Activity feed

### Reports
- Vendor performance reports
- Monthly spend analysis
- Procurement statistics
- CSV/Excel/PDF export

### Audit Logging
- Complete activity tracking
- User action history
- Change tracking

## API Documentation

Swagger API documentation is available at `/api/docs` after starting the backend.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Deployment

See `docs/deployment.md` for production deployment instructions.

## Support

For issues and feature requests, please create an issue in the GitHub repository.

## License

Proprietary - VendorBridge
