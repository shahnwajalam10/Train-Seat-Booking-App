# 🚆 Train Seat Booking App

A simple train seat booking system with user authentication and intelligent seat allocation. Built with a focus on reserving nearby seats when available and managing users and their bookings.

---

## 📋 Features

- 80 seats total (7 seats per row, except last row with 3 seats)
- Users can:
  - Sign up and log in
  - Book up to 7 seats in one transaction
  - Get priority booking in the same row
  - Automatically book the nearest available seats if not in one row
  - Cancel or reset bookings
- Bookings are user-specific
- Seats once booked cannot be booked by others unless canceled/reset
- Single coach only for simplicity

---

## 🧠 Seat Allocation Logic

- Prioritizes booking all requested seats in **one row**.
- If not possible, books **nearest available seats** using intelligent grouping.
- Final row contains **only 3 seats**, handled separately in the logic.

---

## 🛠 Tech Stack

**Frontend**: React.js  
**Backend**: Node.js, Express.js  
**Database**: MongoDB  
**Authentication**: JWT (JSON Web Token)  
**Styling**: Tailwind CSS (or any preferred CSS framework)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shahnwajalam10/Train-Seat-Booking-App.git
cd Train-Seat-Booking-App
