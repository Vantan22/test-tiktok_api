# TikTok Channel Manager

Track and analyze multiple TikTok channels with real-time metrics, historical data, and performance insights.

## Features

- **Dashboard**: Overview of all tracked channels with key metrics (Followers, Engagement, Growth).
- **Channel Tracking**: detailed stats for each channel (Videos, Likes, etc.).
- **Historical Data**: Track growth over time with interactive charts.
- **Comparison**: Compare multiple channels side-by-side.
- **Search**: Find and add new channels easily.
- **Responsive Design**: Mobile-friendly interface with dark/light mode support.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Validation**: Zod + React Hook Form
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- MongoDB (running locally or Atlas)

## Getting Started

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `MONGODB_URI` in `.env.local`.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Dashboard**
   Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

- \`app/\`: Next.js App Router pages and layouts.
- \`components/\`: Reusable UI components.
- \`lib/\`: Utilities, database models, and API clients.
- \`types/\`: TypeScript type definitions.
- \`hooks/\`: Custom React hooks.
- \`actions/\`: Server Actions for backend logic.

## License

MIT
