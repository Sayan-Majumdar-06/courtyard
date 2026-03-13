![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Vercel](https://img.shields.io/badge/Frontend%20Deploy-Vercel-black)
![Render](https://img.shields.io/badge/Backend%20Deploy-Render-purple)

# Courtyard – Private Campus Discussion Platform

Courtyard is a full-stack web application designed to create a **private social and discussion platform for verified college communities**.

Only users with valid institutional email IDs can access their campus space. Within this space, students can participate in Reddit-style communities, create posts, interact through likes and comments, follow other users, and maintain their own customizable profile.

---

## Feature Highlights

- Verified college-only access using institutional email domains
- Reddit-style community discussions
- Post interactions (likes, comments, saves, shares)
- Follow / following system
- Customizable user profiles
- Category-based content filtering.

---

## Live Demo

-🔗 [Live link](https://courtyard-lyart.vercel.app/)

---

## Key Features

### **College Email Verification**  
Users must sign up using their institutional email ID, ensuring that only verified students can access the platform.

### **Campus-Restricted Communities**  
Discussions and posts are filtered based on the user's college, creating a private campus environment.

### **Reddit-style Communities**  
Users can interact through posts and comment threads within different communities.

### **Category-Based Feed Filtering**  
The main feed is organized using categories to improve content discovery.

### **Post Creation and Discussion Threads**  
Students can create posts and engage in threaded discussions.

### **Post Interactions**
Users can interact with posts through:
- Likes
- Comments
- Save posts for later
- Share posts
- likes and comment notifications  

### **Follow System**
Users can **follow other users** and view content from people they are interested in.

### **Profile Management**
Each user has a customizable profile where they can:
- Update username
- Change branch/department
- Edit bio
- Update profile picture
  
Users can only edit **their own profile**, ensuring proper access control.

### **Authentication and Protected Routes**  
Secure authentication system ensuring only logged-in users can access the platform.

---

## Tech Stack

### Frontend
- React+Vite and related libraries
- TailwindCSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- Google OAuth
- College domain verification to restrict access to institutional email Ids only

### Deployment
- Frontend: Vercel
- Server/Backend: Render

---

## Architecture Overview

Courtyard follows a typical full-stack architecture:

- React frontend handles UI and client-side routing.
- Express.js backend exposes REST APIs for authentication, posts, users, and interactions.
- MongoDB stores user data, communities, posts, comments, and relationships.
- Authentication is handled through Google OAuth with domain validation.
- Deployed with a separated frontend and backend architecture.

---

## Application Flow

1. Users sign up or log in using their **college email ID**.
2. The backend verifies the email domain before allowing account creation.
3. After authentication, users can access **communities and discussions specific to their campus**.
4. Users can:
   - browse and create posts (which supports clickable links, images and gifs).
   - filter the feed by categories.
   - interact with posts through : likes, comments, saves, share.
   - search for other users using the search UI.
---

## Screenshots

- Home Feed
<img width="1900" height="907" alt="Image" src="https://github.com/user-attachments/assets/8d90ebb6-5640-428e-bf1e-0cc707d6e669" />

- Create Post
<img width="1898" height="909" alt="Image" src="https://github.com/user-attachments/assets/80054ad6-2fb4-4f8c-9928-2364e7527208" />

- Profile Page
<img width="1898" height="905" alt="Image" src="https://github.com/user-attachments/assets/6150d5e8-7f3d-4342-b749-9a4a40983c79" />

---

## Future Improvements

- Real-time notifications  
- Moderation tools for communities  
- Improved search functionality  
- Mobile responsiveness improvements  
- Real-time discussions using WebSockets

---

## Learning Outcomes

This project helped me gain practical experience in:

- building and structuring a full-stack application
- designing REST APIs
- implementing authentication and protected routes
- managing database schemas and relationships
- deploying and maintaining a production application

---
