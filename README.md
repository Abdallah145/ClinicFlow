# Healix 🏥
### *The Interconnected Clinic Queue & Appointment Management System*

Healix is a comprehensive, multi-portal digital solution engineered to eliminate waiting-room congestion and dynamically synchronize active patient queues. Built as a dual-facing application, Healix bridges the gap between patient-side booking interfaces and administrative dashboard queues.

---

## 🚀 Tech Stack

- **Core Framework**: [React.js](https://react.dev/) (v19) powered by [Vite](https://vite.dev/) for lightning-fast bundling.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for fluid, modern, utility-first user interfaces.
- **Database & Sync**: [Firestore Cloud Database](https://firebase.google.com/docs/firestore) providing real-time data persistence.
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) securing multi-role access (Patients, Doctors, Administrators).
- **Media Uploads**: [Cloudinary API](https://cloudinary.com/) for optimized practitioner profile image processing.

---

## ✨ Key Features & Technical Implementations

Healix is architected with strict performance and data concurrency patterns to ensure reliability in medical environments:

### 1. Real-Time Multi-Portal Queue Synchronization
Instead of standard polling APIs, Healix establishes persistent socket connections directly with Firestore using snapshot listeners. 
- **Implementation**: The `subscribeToDoctorQueue` function inside [`Frontend/src/clinicService.js`](./Frontend/src/clinicService.js) hooks into the `appointments` collection using Firestore’s `onSnapshot`. When an administrator modifies a patient status or a patient books a slot, updates propagate instantly across the active Patient Portal, Doctor Dashboard, and Admin Portal simultaneously without manual page refreshes.

### 2. Concurrency Control & Race Condition Prevention
In high-traffic clinics, multiple rapid asynchronous click events from a patient could bypass standard checks and cause duplicate booking records on the same day.
- **Implementation**: The booking pipeline inside [`Frontend/src/clinicService.js`](./Frontend/src/clinicService.js) handles reservations using a deterministic document ID routing strategy (`patientId_doctorId_date`). Executed inside a Firestore `runTransaction` isolation block, the first click event seals the path atomically. Concurrent duplicate requests are rejected natively by the database, successfully maintaining a clean, sequential `queueNumber` without document duplication.

### 3. High-Performance Data Denormalization
To optimize query speed and minimize database read operations, Healix balances database normalization with smart denormalization.
- **Implementation**: User documents store role markers (e.g. `role: "doctor"`), and active slot availability is maintained directly on the doctor profiles via the `available` property managed in [`admin-panel/src/context/AdminContext.jsx`](./admin-panel/src/context/AdminContext.jsx). Patient booking histories populate denormalized tracking parameters (`doctorName`, `doctorSpecialty`), allowing heavy administrative datagrids to load instantly in a single read without running expensive multi-collection lookup loops.

---

## 📂 Architecture & Folder Structure

Healix is split into two primary roots to cleanly separate client and management portals:

```text
ClinicFlow/
├── Frontend/                 # Patient-Facing Portal (Port 5173)
│   ├── src/
│   │   ├── assets/           # Layout assets and static graphics
│   │   ├── components/       # Shared UI components (Navbar, Footer, ProtectedRoutes)
│   │   ├── context/          # Context states (AuthContext, AppContext)
│   │   ├── page/             # View routers (Home, Doctors, Appointments, Profile)
│   │   ├── clinicService.js  # Core Firebase transactional service methods
│   │   ├── firebaseConfig.js # Firebase Client Initialization
│   │   ├── main.jsx          # Vite entrypoint
│   │   └── App.jsx           # Global shell and route declarations
│   └── package.json
│
├── admin-panel/              # Doctor & Admin Portal (Port 5174)
│   ├── src/
│   │   ├── components/       # Sidebars and contextual action bars
│   │   ├── context/          # State managers (AdminContext, DoctorContext)
│   │   ├── pages/            # View routers (Dashboard, AllAppointments, DoctorProfile)
│   │   ├── firebaseConfig.js # Firebase Admin Config
│   │   ├── main.jsx          # Entrypoint
│   │   └── App.jsx           # Routing configuration
│   └── package.json
🔧 Installation & Setup
Prerequisites
Node.js (v18.0.0 or higher)

NPM (v9.0.0 or higher)

A Firebase Project (with Authentication & Cloud Firestore enabled)

A Cloudinary account for media upload features

1. Clone the Repository

git clone https://github.com/nhahub/NHA-4-226.git
cd Healix
2. Configure Environment Variables
Create a .env file in the root of both directories (Frontend/ and admin-panel/) and insert your credentials:

Code snippet
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
3. Install Dependencies & Run
Run the Patient Portal (Frontend)

cd Frontend
npm install
npm run dev

Run the Doctor/Admin Portal (admin-panel)
Open a new terminal window:


cd admin-panel
npm install
npm run dev

🗄️ Database & Core Schema
Firestore collections are organized as follows:

1. users Collection
Stores details for patients, doctors, and system administrators.

JSON
{
  "uid": "String (Authentication UID)",
  "name": "String",
  "email": "String",
  "role": "String ('patient' | 'doctor' | 'admin')",
  "image": "String (Cloudinary Image URL)",
  "available": "Boolean (Doctors only - toggles search visibility)",
  "speciality": "String (Doctors only - e.g., 'Dermatologist')",
  "address": {
    "line1": "String",
    "line2": "String"
  },
  "updatedAt": "Timestamp"
}
2. appointments Collection
Tracks every consultation, queue location, and payment detail.

JSON
{
  "id": "String (Deterministic key or generated ID)",
  "patientId": "String (User UID)",
  "patientName": "String",
  "doctorId": "String (User UID)",
  "doctorName": "String",
  "doctorSpecialty": "String",
  "date": "String (e.g., 'Jul 11, 2026')",
  "timeSlot": "String (e.g., '10:30 AM')",
  "queueNumber": "Number (Incremented chronologically via transactions)",
  "status": "String ('pending' | 'active' | 'completed' | 'cancelled')",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
3. medicalRecords Collection
Maintains patient clinical documentation, diagnoses, and allergies.

JSON
{
  "patientId": "String (User UID)",
  "bloodType": "String",
  "allergies": [
    "String"
  ],
  "history": [
    {
      "diagnosis": "String",
      "treatment": "String",
      "prescribedMedication": "String",
      "date": "Timestamp"
    }
  ]
}
👥 Contributors & Team Credits
Kerolos Wagdy - Project Leader / Core Backend & Database Architecture

Abdallah Ahmed - Frontend Web Development & Portal Integrations

Martin Milad - UI/UX Layout Component Design

Mohammed Tareq - Client View Layout Routing

Mohammed Fathy - Quality Assurance & E2E Testing Pipeline

Support: Digital Egypt Pioneers Initiative (DEPI) Framework Showcase
