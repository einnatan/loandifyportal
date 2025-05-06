# System Architecture

This document outlines the architecture of the Loandify Loan Aggregator Portal.

## System Overview

Loandify is a loan marketplace application that allows users to apply for loans from multiple lenders through a single interface. The system consists of several core modules including:

- **User Management**: Registration, authentication, profile management
- **Loan Application**: Application forms, validation, submission
- **Loan Discovery**: Browsing, filtering, and comparing loan options
- **Dashboard**: User dashboard showing loan status, analytics, and recommendations
- **Appointment Management**: Scheduling and managing appointments with lenders
- **Analytics**: Performance metrics and user behavior analysis

## Component Structure

The application follows a modular structure with clearly defined responsibilities:

### Frontend Components

- **Authentication**: Handles user signup, login, and session management
- **Profile**: User profile management and settings
- **Loan Application**: Multi-step application process with validation
- **Loan Marketplace**: Discovery and comparison of loan options
- **User Dashboard**: Overview of user's loans, payments, and analytics
- **Appointment System**: Interface for scheduling and managing lender appointments

### Backend Services

- **Authentication Service**: User authentication and authorization
- **User Service**: User profile and settings management
- **Loan Service**: Loan application processing and status tracking
- **Lender Service**: Communication with lender APIs
- **Analytics Service**: Data collection and analysis
- **Notification Service**: Email, SMS, and in-app notifications
- **Appointment Service**: Managing scheduling and communications with lenders

## Key Interfaces

### User Profile

The user profile system includes:
- **Personal Information**: Name, contact details, ID verification
- **Addresses**: Multiple addresses with ability to set primary
- **Preferences**: Notification, privacy, and display settings
- **Security**: Password management, two-factor authentication, login notifications
- **Financial Information**: Income, employment, assets, and liabilities

### Loan Application

The loan application process includes:
- **Personal Information**: Basic user details
- **Financial Information**: Income, employment, expenses
- **Loan Requirements**: Desired amount, term, purpose
- **Document Upload**: ID, proof of income, other required documents

### Appointment Management

The appointment management system includes:
- **Scheduling**: Selection of lender, date, time, and appointment type
- **Management**: Viewing, rescheduling, and cancelling appointments
- **Notifications**: Reminders for upcoming appointments
- **History**: Record of past appointments

## Data Flow

1. **User Registration/Login**: User authenticates via standard credentials or Singpass
2. **Profile Creation**: User completes profile with personal and financial information
3. **Loan Application**: User submits application to multiple lenders
4. **Offer Generation**: System retrieves personalized offers from lenders
5. **Offer Comparison**: User views and compares offers
6. **Appointment Scheduling**: User schedules appointment with selected lender
7. **Loan Finalization**: User finalizes loan with lender
8. **Dashboard Updates**: User monitors loan status and performance

## Technology Stack

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, Singpass/MyInfo integration
- **Hosting**: AWS
- **CI/CD**: GitHub Actions
- **Monitoring**: AWS CloudWatch

## Security Considerations

- All sensitive user data is encrypted at rest and in transit
- Authentication uses industry-standard protocols
- Access control is enforced at both frontend and backend
- Regular security audits and penetration testing
- Compliance with relevant data protection regulations

## Components

### Core Components

- **Navigation**: Main navigation component used across the application
- **Button, Card, Dialog**: UI components from shadcn/ui library
- **LoanCalculator**: Interactive component for loan estimation on the landing page
- **ApplicationWizard**: Multi-step form wizard with progress tracking
- **OfferCard**: Component for displaying individual and bundled loan offers
- **AppointmentScheduler**: Calendar-based appointment booking component

### Pages

- **Home**: Landing page with loan calculator and trust elements
- **Apply**: 4-step loan application wizard
- **Offers**: Loan offers with filtering and bundle options
- **Dashboard**: User dashboard with loan overview and statistics
- **Loyalty**: Loyalty points management and rewards
- **Refer**: Referral program with tracking
- **Admin/Message**: WhatsApp message composer for customer engagement

## System Interfaces

### Internal APIs (mocked/planned)

- **User Data**: Personal information, loan history, and preferences
- **Loan Offers**: Individual and bundled offers based on user profile
- **Appointment Booking**: Calendar slots and confirmation
- **Loyalty Management**: Points tracking and redemption
- **Referral System**: Tracking and rewards

### External Interfaces (mocked)

- **Singpass/MyInfo**: User identity verification and data pre-filling
- **Lender APIs**: Loan offer generation and approval
- **WhatsApp Business API**: Customer messaging and notifications
- **Payment Gateway**: Processing loan disbursements and repayments

## Component Dependencies

- **Layout** → **Navigation**
- **Home** → **LoanCalculator**
- **Apply** → **Progress**, **DocumentUpload**, **ReviewForm**
- **Offers** → **OfferCard**, **FilterControls**
- **Dashboard** → **LoanCard**, **ProgressIndicator**
- All components use shadcn/ui base components

## Diagrams

### Component Hierarchy

```
RootLayout
├── Navigation
├── Home
│   └── LoanCalculator
├── Apply
│   ├── PersonalInfo
│   ├── DocumentUpload
│   ├── ReviewSubmit
│   └── SubmissionSummary
├── Offers
│   ├── FilterControls
│   ├── IndividualOffers
│   └── BundleOffers
├── Dashboard
│   ├── StatCards
│   └── LoanCards
├── Loyalty
│   ├── PointsOverview
│   └── RewardsGrid
└── Refer
    ├── ReferralStats
    └── ReferralForm
```

### User Flow Diagram

```
Landing Page → Application Wizard → Offers Page → 
Appointment Scheduling → Dashboard
```

## Future Development

1. **Real API Integration**: Replace mock data with actual API endpoints
2. **Authentication**: Implement proper authentication with Singpass
3. **Real-time Updates**: Add WebSocket for real-time status updates
4. **Mobile App**: Develop native mobile applications using React Native
5. **Analytics**: Implement user behavior tracking and funnel optimization 