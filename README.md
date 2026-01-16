# Digital Signage System

A dynamic digital signage solution built with Next.js and MongoDB for managing and displaying advertisements and ticker messages on public screens.

## Key Features

-   **Multimedia Ad Rotation**: seamlessly loop through images and videos with configurable durations.
-   **Live Ticker Messages**: Display scrolling announcements and updates at the bottom of the screen.
-   **Remote Management**: A secure `/admin` dashboard allows easy uploading, editing, and reordering of content from any device.
-   **Real-time Updates**: Changes made in the admin panel are reflected on the display immediately without refreshing.
-   **Dark/Light Mode**: Fully themeable interface inspired by modern design principles.

## Getting Started

This project uses [Bun](https://bun.sh) as the runtime and package manager.

### 1. Installation

Install dependencies:
```bash
bun i
```

### 2. Environment Setup

Create a `.env.local` file in the root directory (use `env.example` as a template):

```bash
cp env.example .env.local
```

Define the required variables:

- `MONGODB_URI`: Connection string for your MongoDB database.
- `ADMIN_PASSWORD`: Password for accessing the `/admin` dashboard.
- `SITE_PASSWORD`: Global password required to access the site (Landing, Display, etc.).

### 3. Running the App

Start the development server:
```bash
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

- **Display View**: [http://localhost:3000/display](http://localhost:3000/display)
- **Admin Dashboard**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 4. Building for Production

To build the application for production:

```bash
bun run build
```

To start the production server:

```bash
bun start
```
