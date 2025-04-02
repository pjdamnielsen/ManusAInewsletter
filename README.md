# Newsletter Subscription Website

A GDPR-compliant newsletter subscription website with email confirmation and unsubscribe functionality.

## Features

- GDPR-compliant subscription form
- Cookie consent banner
- Email verification flow
- Unsubscribe functionality
- Privacy policy
- Data deletion capabilities
- Secure database with Supabase
- Email service with Resend

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Resend

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   SENDER_EMAIL=your_sender_email
   WEBSITE_URL=your_website_url
   ```
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The application requires Supabase tables for subscribers and consent logs. You can set up the database by visiting `/api/setup-db` after starting the application.

## Deployment

This project can be deployed to any hosting platform that supports Next.js applications.

## License

This project is licensed under the MIT License.
