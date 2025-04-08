# eTutor Enterprise

<div align="center">
  <img src="frontend/assets/black-graduate-hat.png" alt="eTutor Logo" width="100" />
  <h3>A comprehensive online tutoring platform</h3>
</div>

## 🚀 Overview

eTutor Enterprise is a full-stack educational platform that connects students with tutors in a digital learning environment. The application supports document sharing, messaging, virtual meetings, and blog functionality.

## 📋 Features

- **Class Management** - Create and manage classes with student enrollment
- **Document Sharing** - Upload and access educational resources
- **Real-time Messaging** - Direct communication between students and tutors
- **Meeting Scheduling** - Arrange and manage virtual study sessions
- **Blog System** - Share educational content and insights
- **Multi-user Roles** - Admin, Tutor, and Student access levels
- **Responsive Design** - Works on both mobile and web interfaces

## 🛠️ Tech Stack

### Frontend
- React Native / Expo
- TypeScript
- NativeWind (Tailwind CSS)
- GlueStack UI
- React Navigation

### Backend
- Node.js (v20.14.0)
- Express.js
- MongoDB
- Socket.io for real-time messaging


## 🏗️ Project Structure

```
/
├── backend/            # Node.js server
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   └── utils/          # Helper functions
├── frontend/           # React Native app
│   ├── assets/         # Images and static files
│   ├── components/     # UI components
│   │   └── ui/         # GlueStack UI components
│   └── src/            # Application source
│       ├── navigation/ # Navigation setup
│       ├── screens/    # Screen components
│       └── store/      # State management
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.14.0)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/eTutor-Enterprise.git
cd eTutor-Enterprise
```

2. Install backend dependencies
```bash
cd backend
npm install --force
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

5. Start the development servers
```bash
# In backend directory
npm start

# In frontend directory
npm start
```

## 📱 Running on Mobile

1. Install the Expo Go app on your mobile device
2. Scan the QR code from the terminal after running `npm start`

## 🌐 Running on Web

Access the web version by pressing `w` after running `npm start` in the frontend directory.

## 👥 Role-Based Access

- **Admin**: Full system access, manage classes and users
- **Tutor**: Manage classes, documents, and communicate with students
- **Student**: Access class materials, communicate with tutors


## ✨ Acknowledgements

- [React Native](https://reactnative.dev/)
- [GlueStack UI](https://ui.gluestack.io/)
- [NativeWind](https://nativewind.io/)
- [Expo](https://expo.dev/)