# Elmosliga Frontend

A modern, responsive React frontend for the Elmosliga fantasy league prediction platform.

## Features

- 🔐 **Authentication**: Login, registration, password reset, and account activation
- 🏆 **League Management**: Browse leagues and make predictions
- 📊 **Leaderboards**: View global and league-specific leaderboards
- 👤 **User Profiles**: Manage your profile and view your predictions
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, minimal design with smooth animations

## Tech Stack

- **React 19** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and dev server

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Django backend running (see Elmosliga backend repository)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

Update the URL to match your Django backend URL.

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx       # Main layout with navigation
│   └── ProtectedRoute.jsx # Route protection component
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication context
├── pages/               # Page components
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── Leagues.jsx      # League listing and predictions
│   ├── Predictions.jsx # User predictions
│   ├── Leaderboard.jsx  # Leaderboard views
│   └── Profile.jsx      # User profile
├── services/            # API service layer
│   ├── api.js           # Axios configuration
│   ├── authService.js   # Authentication API calls
│   ├── leagueService.js # League and prediction API calls
│   └── profileService.js # Profile API calls
├── App.jsx              # Main app component with routing
└── main.jsx             # Entry point
```

## API Integration

The frontend communicates with the Django REST API backend. Make sure your backend is running and accessible at the URL specified in `.env`.

### API Endpoints Used

- **Authentication**: `/accounts/api/v1/`
  - Register, login, logout
  - Password reset and change
  - Account activation

- **Leagues**: `/league/`
  - List leagues and teams
  - Create/update predictions
  - View leaderboards

- **Profile**: `/accounts/api/v1/profile/`
  - Get and update user profile

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User registration with email verification
- JWT-based authentication
- Password reset via email
- Protected routes for authenticated users

### Leagues & Predictions
- Browse active leagues
- View teams for each league
- Make predictions on league winners
- View your predictions and points

### Leaderboards
- Global leaderboard showing all users
- League-specific leaderboards
- Rank badges for top 3 positions

### Profile Management
- View and edit profile information
- Upload profile image
- Change password

## Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Elmosliga platform.
