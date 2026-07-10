# SkillBridge - AI-Powered Freelance Collaboration Platform

SkillBridge is a comprehensive full-stack web application designed to connect clients with students or freelancers for project-based work. It functions as a platform where clients can post projects, students can apply, and upon acceptance, collaborate within a dedicated workspace.

## 🚀 Features

- **Role-Based Access**: Dedicated dashboards for Admins, Clients, and Students.
- **Project Discovery & Management**: Clients can post projects, and students can browse and apply for them.
- **Real-Time Collaboration**: Dedicated workspaces with live messaging powered by Socket.io.
- **File Management**: Secure file uploads for profile pictures and project attachments using Cloudinary.
- **AI Integration**: AI-powered features for matching and enhancing project descriptions using Groq SDK.
- **Comprehensive Profiles**: Detailed profiles for both clients and students showcasing skills, education, and company information.
- **Review System**: Post-project ratings and feedback.

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, PostCSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM v7
- **API Communication**: Axios
- **Real-Time**: Socket.io Client
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & Bcrypt
- **Real-Time**: Socket.io
- **File Storage**: Cloudinary & Multer
- **AI Integration**: Groq SDK
- **Security**: Helmet, Express Rate Limit, Express Mongo Sanitize

## 📁 Project Structure

```text
SkillBridge/
├── client/          # React frontend application
│   ├── src/         # React components, pages, and contexts
│   ├── public/      # Static assets
│   └── ...
├── server/          # Node.js + Express backend
│   ├── config/      # DB and Cloudinary configurations
│   ├── controllers/ # Route logic
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── services/    # Business logic (AI, messaging, etc.)
│   └── ...
└── .gitignore       # Root gitignore
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Cloudinary account for image uploads
- Groq API Key for AI features

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/98ankit-mishra/SkillBridge-AI-Powered-Freelance-Collaboration-Platform.git
   cd SkillBridge-AI-Powered-Freelance-Collaboration-Platform
   ```

2. **Setup the Server:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory and add the necessary environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     GROQ_API_KEY=your_groq_api_key
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

3. **Setup the Client:**
   ```bash
   cd ../client
   npm install
   ```
   - Start the Vite development server:
     ```bash
     npm run dev
     ```

## 🤝 Contributing

Contributions are always welcome! Feel free to open a pull request or create an issue.

## 📄 License

This project is licensed under the ISC License.
