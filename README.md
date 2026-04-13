# LandlordPro MVP

A minimal, frontend-only property management system for single landlords.

## Features

- **Property Management**: Add, edit, and delete properties.
- **Financial Tracking**: Track income (rent, late fees, deposits) and expenses (maintenance, taxes, etc.) per property.
- **Real-time Updates**: UI refreshes automatically after any data change.
- **Clean UI**: Minimalist design focused on utility and clarity.

## Tech Stack

- **React 19** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

The application requires an external REST API. Set the base URL in your environment variables.

Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://your-api-endpoint.com
```

### Running Locally

```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```
The static files will be generated in the `dist` folder.

## Deployment to Cloud Run

This project includes a `Dockerfile` suitable for Google Cloud Run.

1. Build the image:
   ```bash
   docker build -t landlord-pro .
   ```
2. Push to Google Container Registry or Artifact Registry.
3. Deploy to Cloud Run, ensuring you set the `VITE_API_BASE_URL` environment variable during deployment.

## API Endpoints Used

- `GET /properties`
- `GET /properties/{id}`
- `POST /properties`
- `PUT /properties/{id}`
- `DELETE /properties/{id}`
- `GET /properties/{id}/income`
- `POST /properties/{id}/income`
- `GET /properties/{id}/expenses`
- `POST /properties/{id}/expenses`
- `DELETE /income/{id}`
- `DELETE /expenses/{id}`
