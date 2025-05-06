# Loandify – Loan Aggregator Portal

Loandify is a customer-facing web portal that allows customers to apply for personal loans with multiple lenders through a single application. The goal is to deliver a seamless, trustworthy, and intuitive loan aggregation experience—combining the credibility of a financial institution with the ease of a consumer tech product.

## Project Overview

This portal prototype demonstrates a loan aggregator interface with a fully functional UI workflow. It features a mobile-first design approach with a clean, modern UI built using Next.js, Tailwind CSS, and shadcn/ui components.

## Features

- **Loan Application Wizard**: Multi-step form with progress tracking
- **Personalized Offers**: Individual and bundled loan offers from multiple lenders
- **Appointment Scheduling**: Calendar-based booking system for lender meetings
- **Customer Dashboard**: Overview of active loans with repayment tracking
- **Loyalty Program**: Points system with rewards and redemption
- **Referral System**: Customer referral tracking with personalized links
- **Admin Tools**: WhatsApp message composer for customer engagement

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env.local` and adjust values as needed
4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Next.js**: React framework for server-rendered applications
- **React**: UI library for component-based development
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Framer Motion**: Animation library for smooth transitions

## Project Structure

```
/app
  /admin          # Admin-specific pages
    /message      # WhatsApp composer tool
  /apply          # Loan application wizard
  /components     # Reusable UI components
    /ui           # shadcn UI components
  /dashboard      # Customer dashboard with loan overview
  /loyalty        # Loyalty points and rewards
  /offers         # Loan offers display and filtering
  /refer          # Referral system
  /styles         # CSS and styling
/docs             # Documentation
/public           # Static assets
```

## Key Features

### Loan Application Wizard

The application process is broken down into easy steps:
1. Personal Information (pre-filled from Singpass)
2. Document Upload
3. Review & Submit
4. Submission Summary

### Offers Engine

After submission, the system presents:
- Individual lender offers with detailed loan terms
- Bundled offers combining multiple lenders for higher loan amounts
- Filtering options based on loan amount, interest rate, and monthly payments

### Customer Dashboard

Provides an overview of:
- Active loans and payment status
- Repayment progress
- Outstanding balances
- Special offers based on credit history

### Loyalty & Rewards

A comprehensive loyalty program including:
- Points earning through loan applications, referrals, and repayments
- Tiered membership levels
- Rewards marketplace with various redemption options

## Mobile First

The entire application is designed with a mobile-first approach, ensuring optimal user experience across all devices from smartphones to desktops.

## Contributing

Please refer to the `.cursorrules` file for development guidelines and best practices. 