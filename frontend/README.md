# 🏥 Clinic Manager - MERN Stack Application

A full-stack clinic management system built with the MERN stack (MongoDB, Express, React, Node.js). Designed for doctors and clinic staff to manage patients, sessions, appointments, and track payments efficiently.

🔗 **Live Demo:** [Clinic-Manager](https://clinic-manager-mern-stack.vercel.app)

---

##  Features

### Authentication
- Doctor registration and login with JWT authentication
- Protected routes for authenticated users
- Auto-logout on token expiry
- Account deletion with cascade delete (removes all associated data)

### Patient Management
-  Add new patients with name and phone number
-  View all patients
-  Edit patient details
-  Delete patients (automatically removes all their sessions)

### Session Management
-  Add sessions for each patient with date, time, description, and payment
-  Edit session details
-  Delete sessions

### Appointments Dashboard
-  View all upcoming appointments (today and future)
-  Patient names are clickable to view their full session history
-  Sorted by date (soonest first)

### User Experience
-  Toast notifications for success, error, and info messages
-  Loading states with spinner
-  Error handling with retry functionality
-  Responsive design (mobile, tablet, desktop)

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **React Router v6** | Client-side routing |
| **Vite** | Build tool and dev server |
| **Context API + useReducer** | State management |
| **React Phone Number Input** | Phone number input with country selector |
| **React Toastify** | Toast notifications |
| **React Loader Spinner** | Loading animations |
| **CSS3** | Custom responsive styling |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework for REST API |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcrypt** | Password hashing |
| **validator** | Email and password validation |
| **cors** | Cross-Origin Resource Sharing |

### DevOps & Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Database hosting |
| **GitHub** | Version control |

---

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Milad7774/clinic-manager.git
cd clinic-manager