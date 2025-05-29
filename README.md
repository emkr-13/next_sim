# Next.js Inventory Management System (SIM)

A modern inventory management system built with Next.js, featuring account management, inventory tracking, store management, and category organization.

## Features

- User authentication and account management
- Inventory management
- Store location management
- Product category organization
- Responsive UI with light/dark mode support

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd next_sim
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3080/api/
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Project Structure

- `/app` - Next.js app router pages and components
- `/components` - Reusable UI components
- `/lib` - Utility functions and hooks
- `/public` - Static assets

## Backend API

This frontend application requires a backend API server running at the URL specified in the `NEXT_PUBLIC_BASE_URL` environment variable. Make sure your backend server is running and accessible.

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components

## License

[MIT](LICENSE)
