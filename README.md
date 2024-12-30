# Railway Seat Booking System

This is a Railway seat booking system where users can reserve seats in a train. The train has 80 seats, with 7 seats per row except the last row which has 3 seats. Users can book seats either in one row or in nearby seats if a full row is unavailable.

## Features:
- **User Login and Signup**: Users can create an account and log in.
- **Seat Reservation**: Users can reserve up to 7 seats at a time.
- **Seat Availability**: Seats are reserved in the same row if possible. If not, seats are booked in nearby rows.
- **Seat Locking**: Once a seat is reserved, it cannot be booked by another user until canceled or reset.

## Environment Variables

Before running the project locally, make sure to set up the required environment variables.

### Required Environment Variables:
1. `JWT_SECRET_KEY`: A secret key used for signing JWT tokens (for user authentication).
2. `DATABASE_URL`: The connection string to your database (usually a PostgreSQL or MongoDB URL).

You can create a `.env` file in the root of your project with the following content:

```env
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=your-database-url
```