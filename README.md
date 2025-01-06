# Docket

Docket is a comprehensive work order management system built with Next.js, designed to streamline the process of managing and tracking work orders across an organization. The application provides a sophisticated scheduling and event management platform with role-based access control.

## Key Features

- **Interactive Calendar Interface**: Built with FullCalendar, providing an intuitive way to view and manage work orders
- **Role-Based Access Control**: Supports multiple user roles including Admin, Coordinator, Supervisor, and Technician
- **Work Order Management**:
  - Create, edit, and track work orders
  - Different types of work orders: Pickup, Setup, Delivery, Activation, and Teardown
  - Status tracking (Pending, In Progress, Completed, Cancelled)
- **Real-time Statistics**: Track work order metrics and performance through the stats bar
- **Responsive Design**: Full mobile support with adaptive sidebar and navigation
- **User Management**: Complete user authentication and authorization system
- **Equipment Tracking**: Monitor equipment status (Available, In Use, Maintenance, Out of Service)
- **Document Management**: Attach and manage documents related to work orders

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Tailwind CSS
- **Calendar**: FullCalendar integration

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
