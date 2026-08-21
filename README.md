# URL Shortener

A full-stack Node.js application that allows users to create shortened versions of long URLs with user authentication and analytics tracking.

## Features

- **User Authentication**: Secure user registration and login with bcrypt password hashing
- **URL Shortening**: Convert long URLs into short, easy-to-share codes
- **Dashboard**: View all shortened URLs and track click counts
- **Click Analytics**: Monitor how many times each shortened URL has been clicked
- **Session Management**: Secure session handling with express-session
- **User-Specific URLs**: Each user can only access and manage their own shortened URLs

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS (Embedded JavaScript templating)
- **Database**: MySQL
- **Authentication**: bcrypt for password hashing
- **Session Management**: express-session

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alishgc/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_database_password
   DB_NAME=url_shortener
   DB_PORT=3306
   PORT=3000
   SESSION_SECRET=your_session_secret
   ```

4. **Set up the database**
   - Create a MySQL database named `url_shortener`
   - Run the SQL migration files in the `/sql` directory to create tables

5. **Start the server**
   ```bash
   # Production
   npm start

   # Development (with nodemon)
   npm run dev
   ```

The server will run on the port specified in your `.env` file (default: 3000).

## Project Structure

```
url-shortener/
├── app.js                 # Main application entry point
├── package.json          # Project dependencies
├── .env.example          # Environment variables template
├── db/                   # Database configuration
├── middleware/           # Custom middleware (e.g., authentication)
├── routes/               # API routes
│   ├── auth.js          # Authentication routes
│   ├── urls.js          # URL management routes
│   └── redirect.js      # Redirect to original URL
├── sql/                 # Database schema and migrations
├── views/               # EJS templates
└── public/              # Static files (CSS, JS, images)
```

## API Routes

- **`/auth/register`** - User registration
- **`/auth/login`** - User login
- **`/auth/logout`** - User logout
- **`/urls/create`** - Create a shortened URL
- **`/urls/delete`** - Delete a shortened URL
- **`/dashboard`** - View user's shortened URLs (requires authentication)
- **`/:shortCode`** - Redirect to original URL

## Usage

1. **Register a new account**
   - Navigate to the registration page and create an account

2. **Create shortened URLs**
   - Log in to your account
   - Enter a long URL and create a shortened version
   - Share the shortened URL with others

3. **Track analytics**
   - View your dashboard to see all shortened URLs
   - Monitor click counts for each URL
   - See creation dates for your URLs

## Database Schema

The application uses a MySQL database with tables for:
- **users** - User account information
- **urls** - Shortened URLs with metadata and click counts

See `/sql` directory for the complete schema.

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- User-specific data isolation
- Environment variable protection for sensitive data

## Development

To run the project in development mode with hot-reload:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when file changes are detected.

## License

ISC

## Author

Created by alishgc

## Contributing

Feel free to fork this project and submit pull requests for any improvements.
