# Project Flow

This document traces how the application runs from startup through routing and page rendering.

## 1. Startup Flow

The app starts from the Vite entry point in [Frontend/src/main.jsx](Frontend/src/main.jsx).

```mermaid
flowchart TD
    A[Vite launches app] --> B[main.jsx mounts React root]
    B --> C[BrowserRouter wraps the app]
    C --> D[AppContextProvider provides shared state]
    D --> E[App.jsx renders the full shell]
    E --> F[AuthProvider initializes auth state]
    F --> G[Navbar + Routes render based on URL]
```

### What happens at startup
1. Vite loads the React application.
2. [Frontend/src/main.jsx](Frontend/src/main.jsx) creates the root React container.
3. The app is wrapped in a router and a global app context provider.
4. [Frontend/src/App.jsx](Frontend/src/App.jsx) renders the base UI shell.
5. [Frontend/src/context/AuthContext.jsx](Frontend/src/context/AuthContext.jsx) begins watching Firebase authentication state.
6. The current route determines which page component is shown.

## 2. App Shell Flow

[Frontend/src/App.jsx](Frontend/src/App.jsx) is the central routing shell.

```mermaid
flowchart LR
    A[App.jsx] --> B[Navbar]
    A --> C[Routes]
    A --> D[Footer]
    C --> E[Home]
    C --> F[Doctors]
    C --> G[Login]
    C --> H[Appointment]
    C --> I[MyAppointments]
    C --> J[DoctorDashboard]
```

### App shell responsibilities
- renders the navigation bar at the top
- renders the route-specific page content in the middle
- renders the footer at the bottom
- wraps the app in the authentication provider
- defines the main route table

## 3. Route-to-Page Mapping

| Route | Page component | Purpose |
| --- | --- | --- |
| / | [Frontend/src/page/Home.jsx](Frontend/src/page/Home.jsx) | Landing page |
| /doctors | [Frontend/src/page/Doctors.jsx](Frontend/src/page/Doctors.jsx) | Browse all doctors |
| /doctors/:speciality | [Frontend/src/page/Doctors.jsx](Frontend/src/page/Doctors.jsx) | Filter doctors by speciality |
| /login | [Frontend/src/page/Login.jsx](Frontend/src/page/Login.jsx) | Sign up and login |
| /about | [Frontend/src/page/About.jsx](Frontend/src/page/About.jsx) | Informational page |
| /contact | [Frontend/src/page/Contact.jsx](Frontend/src/page/Contact.jsx) | Contact page |
| /my-profile | [Frontend/src/page/MyProfile.jsx](Frontend/src/page/MyProfile.jsx) | Profile page |
| /my-appointment | [Frontend/src/page/MyAppointments.jsx](Frontend/src/page/MyAppointments.jsx) | Patient appointment history |
| /appointment/:docId | [Frontend/src/page/Appointment.jsx](Frontend/src/page/Appointment.jsx) | Doctor booking experience |
| /doctor-dashboard | [Frontend/src/page/DoctorDashboard.jsx](Frontend/src/page/DoctorDashboard.jsx) | Protected doctor queue dashboard |

## 4. Protected Route Flow

Protected access is handled by [Frontend/src/components/ProtectedRoutes.jsx](Frontend/src/components/ProtectedRoutes.jsx).

```mermaid
flowchart TD
    A[User visits protected route] --> B[ProtectedRoute checks auth state]
    B --> C{User logged in?}
    C -- No --> D[Redirect to /login]
    C -- Yes --> E{Role allowed?}
    E -- No --> F[Redirect to /unauthorized]
    E -- Yes --> G[Render requested page]
```

## 5. Patient Booking Flow

A typical patient journey looks like this:

```mermaid
flowchart TD
    A[User opens /doctors] --> B[Selects a doctor]
    B --> C[Opens /appointment/:docId]
    C --> D[Chooses date and time]
    D --> E[Booking action triggers clinic service]
    E --> F[Appointment is written to Firestore]
    F --> G[User can see it in /my-appointment]
```

### Relevant files
- [Frontend/src/page/Doctors.jsx](Frontend/src/page/Doctors.jsx)
- [Frontend/src/page/Appointment.jsx](Frontend/src/page/Appointment.jsx)
- [Frontend/src/clinicService.js](Frontend/src/clinicService.js)
- [Frontend/src/page/MyAppointments.jsx](Frontend/src/page/MyAppointments.jsx)

## 6. Doctor Dashboard Flow

The doctor experience uses a live data stream:

```mermaid
flowchart TD
    A[Doctor visits /doctor-dashboard] --> B[AuthContext provides current user]
    B --> C[DoctorDashboard subscribes to queue updates]
    C --> D[Firestore appointments stream updates the UI]
    D --> E[Doctor changes appointment status]
    E --> F[Status update is written back to Firestore]
```

### Relevant files
- [Frontend/src/page/DoctorDashboard.jsx](Frontend/src/page/DoctorDashboard.jsx)
- [Frontend/src/clinicService.js](Frontend/src/clinicService.js)

## 7. Overall Mental Model

The app flow is simple and layered:

1. Bootstrap the React app
2. Provide routing and global state
3. Resolve the current route
4. Render the matching page
5. Let that page use context and service functions to interact with Firebase

This makes the project feel like a small, route-driven React application with Firebase as its persistence layer rather than a large-scale enterprise architecture.
