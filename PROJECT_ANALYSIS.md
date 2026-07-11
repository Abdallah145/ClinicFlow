# Project Analysis

This document summarizes the high-level architecture of the patient-facing Vite + React + Firebase application implemented under [Frontend](Frontend).

## 1. Purpose

The application is a clinic management web app focused on:

- helping patients browse doctors
- allowing patients to book appointments
- letting patients view their appointment history
- giving doctors a queue-based dashboard for appointment management
- using Firebase Authentication and Firestore for identity and booking data

## 2. Main Features

### Public-facing experience
- Home page with hero-style landing sections and doctor highlights
- Doctor listing page with speciality-based filtering
- Doctor profile and appointment booking experience
- Login and account creation flow
- About and contact pages

### Patient workflow
- Register or log in
- Open a doctor profile
- Select a date and time slot
- Book an appointment
- View booked appointments in the patient appointments page

### Doctor workflow
- Access a doctor dashboard after role-based authentication
- View appointments in a queue-style list
- Change appointment status such as active or completed

## 3. Architecture Overview

### Frontend structure
The app is organized around a standard React + Vite setup:

- [Frontend/src/main.jsx](Frontend/src/main.jsx) bootstraps the app
- [Frontend/src/App.jsx](Frontend/src/App.jsx) defines the app shell and route table
- [Frontend/src/components](Frontend/src/components) contains shared UI pieces such as navbar, footer, doctor cards, and related doctor modules
- [Frontend/src/page](Frontend/src/page) contains route-level pages
- [Frontend/src/context](Frontend/src/context) holds application-level state providers

### State management approach
The app uses React context rather than a larger state library:

- [Frontend/src/context/AppContext.jsx](Frontend/src/context/AppContext.jsx) stores doctor data and appointment-related state for the broader UI
- [Frontend/src/context/AuthContext.jsx](Frontend/src/context/AuthContext.jsx) stores authentication state and the active user role

### Backend and data layer
The app uses Firebase services directly from the frontend:

- Firebase Authentication for sign-in and sign-up
- Firestore for user profiles, appointment records, and medical records
- [Frontend/src/firebaseConfig.js](Frontend/src/firebaseConfig.js) initializes Firebase
- [Frontend/src/authService.js](Frontend/src/authService.js) handles user registration and login helpers
- [Frontend/src/clinicService.js](Frontend/src/clinicService.js) handles appointment booking and queue-related database operations

## 4. Data Flow

### Authentication flow
1. The app initializes Firebase in [Frontend/src/firebaseConfig.js](Frontend/src/firebaseConfig.js).
2. [Frontend/src/context/AuthContext.jsx](Frontend/src/context/AuthContext.jsx) listens for authentication state changes.
3. When a user signs in, the app loads the corresponding Firestore user document and stores the role.
4. The app uses that role to decide whether the user may enter protected routes.

### Doctor discovery flow
1. A static doctor catalog is imported from the assets module.
2. [Frontend/src/context/AppContext.jsx](Frontend/src/context/AppContext.jsx) exposes that catalog globally.
3. Pages such as [Frontend/src/page/Doctors.jsx](Frontend/src/page/Doctors.jsx) read the data and render doctor cards.

### Appointment booking flow
1. The booking UI lives in [Frontend/src/page/Appointment.jsx](Frontend/src/page/Appointment.jsx).
2. The page gathers the selected doctor, date, and time.
3. It calls the booking service in [Frontend/src/clinicService.js](Frontend/src/clinicService.js).
4. The service writes an appointment document into Firestore.
5. The patient can later view those appointments in [Frontend/src/page/MyAppointments.jsx](Frontend/src/page/MyAppointments.jsx).

### Doctor queue flow
1. The doctor dashboard in [Frontend/src/page/DoctorDashboard.jsx](Frontend/src/page/DoctorDashboard.jsx) subscribes to appointment updates.
2. Firestore updates are streamed into the component in real time.
3. The doctor can update appointment statuses, which are written back into Firestore.

## 5. Routing Flow

The app uses client-side routing through React Router.

### Public routes
- / → Home
- /doctors → Doctor listing
- /doctors/:speciality → Filtered doctor listing
- /login → Authentication page
- /about → About page
- /contact → Contact page

### User-specific routes
- /my-profile → User profile page
- /my-appointment → Patient appointment history
- /appointment/:docId → Booking page for a selected doctor

### Protected route
- /doctor-dashboard → Protected route for doctors

The protection logic lives in [Frontend/src/components/ProtectedRoutes.jsx](Frontend/src/components/ProtectedRoutes.jsx), which checks authentication and role before allowing access.

## 6. High-Level Mental Model

The app is best understood as three layers:

1. Shell layer: navigation, route rendering, and global providers
2. Feature layer: pages for home, doctors, booking, appointments, and doctor dashboard
3. Data layer: Firebase Authentication and Firestore-backed services

In short, the project is a React-based clinic booking experience with role-based access and Firestore-backed workflow management.
