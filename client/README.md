# Gari Chai Client

A React-based car rental platform frontend.

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file with Firebase and API configuration:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # API Configuration
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## Project Structure

- `src/pages/` - Page components
- `src/components/` - Reusable UI components
- `src/assets/` - Authentication and utilities
- `src/utils/` - Helper functions

## Technologies

- React 18.3.1
- Vite 6.0.3
- TailwindCSS 3.4.17
- Firebase 11.1.0
