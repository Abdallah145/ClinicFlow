# **Private Clinic & Healthcare Facility Queue Management System**

### **Project Proposal**

**Prepared By:**

* Kerolos Wagdy Awad Mohareb  
* Abdullah Ahmed Abo Alyazid Hassan   
* Martin Milad Abdou Mankarious   
* Mohamed Tareq Mohamed Hassan   
* Mohamed Fathy Hassan Ahmed 

**Track:** React Frontend Web Developer  
**Group:** CAI4\_SWD2\_S7  
**Instructor:** Mohamed Abdelsalam

---

## **1-Executive Summary**

The Clinic Queue Management System (**Healix**) is a web-based application designed to improve patient flow in private clinics, polyclinics, and healthcare facilities. Traditional queuing methods in these centers often lead to long waiting times, overcrowding, and inefficient management by clinic staff and practitioners.

This project provides a digital platform where patients can book slots online, select their preferred doctor, and track their position in real-time. Doctors can manage their own patient queues efficiently, update patient status through a dedicated dashboard, and access patient medical records. Receptionists and clinic administrators can oversee multiple queues, configure doctor availability, and monitor consultation rooms to ensure smooth daily operations.

Developed using React.js and Vite for the frontend, Tailwind CSS for modern responsive styling, and Firestore Cloud Database for real-time synchronization, the system delivers a seamless and secure experience. By optimizing queue management with atomic transaction processing and live snapshot listeners, the system enhances patient satisfaction and improves operational efficiency in private healthcare settings.

---

## **2-Problem Statement**

Private clinics and healthcare facilities often face inefficiencies in managing patient flow, especially during peak hours. Manual queuing systems at reception desks result in long waiting times, physical overcrowding in small waiting areas, and confusion. Patients frequently do not know their queue position or expected waiting time, leading to frustration and poorly timed arrivals.

Clinic receptionists and attending doctors face challenges in coordinating multiple patients across different specialties, managing availability, and maintaining smooth operations. The lack of role-specific, synchronized tools for doctors and administrative staff reduces overall efficiency. Furthermore, rapid concurrent bookings can lead to double-bookings or database inconsistencies. Therefore, there is a need for a robust digital solution tailored to clinics that allows patients to join queues online securely, provides doctors with real-time dashboards for managing appointments, and enables administrators to oversee clinic capacity dynamically.

---

## **3-Project Objectives**

**The main objectives of this project are:**

* To digitize and automate queue management in private clinics using a synchronized cloud database.  
* To allow patients to select their specific specialty or preferred doctor and book appointments online.  
* To provide private practitioners with a dedicated dashboard to manage their own real-time patient queues.  
* To reduce patient waiting time and physical overcrowding in clinic waiting rooms through live status updates.  
* To implement strict concurrency control (atomic transactions) to prevent duplicate bookings and queue collisions.  
* To provide administrative staff with tools to monitor all clinic queues, toggle doctor availability, and view key metrics.  
* To ensure secure, role-based navigation and authentication using Firebase Auth.  
* To deliver a modern, fully responsive user interface built with Tailwind CSS.

---

## **4-System Overview**

The Clinic Queue Management System is a dual-portal application developed with React.js, Vite, and Firebase. It features a patient portal and an administrative dashboard to coordinate clinic operations.

**Key Components:**

* **Patient Portal (Frontend):** Allows users to sign up/login, browse available doctors, select timeslots, securely book appointments, and track their appointment list and history.  
* **Doctor Dashboard (admin-panel):** Allows practitioners to view their daily schedule, manage active queues in real-time, update consultation statuses, and view patient medical records.  
* **Admin Dashboard (admin-panel):** Enables administrators to manage overall clinic settings, view dashboard analytics, toggle doctor availability on public grids, and cancel appointments when needed.
* **Firebase Backend & Cloudinary:** Powered by Firebase Authentication for role validation, Firestore for transaction-safe storage, and Cloudinary for doctor profile image processing.

**Technical Architecture Focus:**

* **Real-time Data Streaming:** Utilizes Firestore `onSnapshot` listeners to propagate status updates instantly across portals.  
* **Atomic Transaction Guards:** Uses Firestore `runTransaction` combined with a deterministic document ID routing strategy (`patientId_doctorId_date`) to prevent duplicate bookings.  
* **Optimized Data Denormalization:** Denormalizes fields such as `doctorName` and `doctorSpecialty` within appointments to enable single-read directory listings and fast admin datagrid loads.

---

## **5-System Features**

**Patient Features:**

* **Secure Authentication:** Sign up, login, and profile editing (with Cloudinary-backed avatar uploads).  
* **Doctor Selection:** Filter doctors by specialty and toggle view lists based on live availability.  
* **Appointment Booking:** Select specific dates and timeslots. Calculates incremental queue numbers safely.  
* **My Appointments list:** Displays booked consultations with real-time status updates (pending, active, completed, cancelled).  
* **Responsive Design:** Native mobile-first layout optimized for mobile and desktop screens.

**Doctor Features:**

* **Dedicated Doctor Queue:** Access to schedules restricted to patients assigned specifically to the logged-in doctor.  
* **Consultation Progress Controls:** Advance active queues, call the next patient, and mark appointments as completed.  
* **Medical Records Portal:** Access and update patients' history, blood type, and allergy information safely.  
* **Profile Management:** Edit experience, fee structure, and profile imagery.

**Staff/Admin Features:**

* **Master Directory Management:** Add, edit, or remove doctor profiles and update clinic availability flags.  
* **Central Queue Monitor:** Review all scheduled appointments across all departments.  
* **Dashboard Analytics:** Live metrics showing total doctors, registered patients, overall appointments, and a feed of recent bookings.  
* **Global Cancellation Override:** Cancel appointments directly with cascading updates to dashboard counters.  
* **Role-Based Navigation:** The UI dynamically adjusts routes and sidebars based on authenticated user claims (Patient, Doctor, or Administrator).

---

## **6- User Roles**

| Role | Description | Responsibilities / Access |
| :---- | :---- | :---- |
| **Patient** | Clients booking consultations. | - Sign up / login via Firebase Auth.<br>- Browse available doctors and specialties.<br>- Book appointments and view active queue numbers.<br>- Modify profile images via Cloudinary. |
| **Doctor** | Healthcare providers. | - Authenticate and access a private queue dashboard.<br>- View patient details and update appointment status.<br>- Read and update patient medical records. |
| **Admin** | Clinic managers. | - Monitor system-wide appointments and analytics.<br>- Toggle doctor availability flags on patient search pages.<br>- Register new doctors and modify administrative settings. |

---

## **7-Conclusion**

The Clinic Queue Management System (**Healix**) provides an end-to-end, real-time solution specifically tailored to improve patient flow in healthcare facilities. By replacing outdated manual sheets with synchronized cloud-based portals, Healix reduces waiting times, prevents concurrency conflicts, and simplifies clinic scheduling. Built upon a modern stack of React, Tailwind CSS, Firestore, and Cloudinary, this project demonstrates a production-ready system capable of coordinating patients, doctors, and administrators efficiently.