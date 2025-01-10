# 🚗 Gari Chai: A Modern Car Rental Platform

## Live Demo

Firebase: [https://gari-chai-27.web.app/](https://gari-chai-27.web.app/)  
Surge: [https://gari-chai.surge.sh/](https://gari-chai.surge.sh/)  
Netlify: [https://gari-chai.netlify.app/](https://gari-chai.netlify.app/)

**Gari Chai** is a user-friendly platform designed for seamless car rental and management. It enables users to explore, book, and manage cars for rental while offering features for car owners to list and manage their vehicles. Built with the MERN stack, the platform focuses on efficiency, security, and a responsive design for optimal user experience.

---

## Table of Contents

1. [Live Demo](#live-demo)
2. [Screenshots](#screenshots)
3. [Features](#features)
4. [Authentication](#authentication)
5. [Application Structure](#application-structure)
   - [Frontend](#frontend)
   - [Backend](#backend)
6. [Technologies Used](#technologies-used)
7. [🛠️ Dependencies](#%EF%B8%8F-dependencies)
8. [🚀 How to Run Locally](#-how-to-run-locally)
9. [🔧 Additional Notes](#-additional-notes)
10. [The server API address](#the-server-api-address)
11. [Conclusion](#conclusion)

---

## Screenshots

![Home Page](https://i.ibb.co.com/q79rN1b/gari-chai-surge-sh-home.png)

---

## Features

- **User Authentication**: Secure login and registration system with Firebase email/password and Google authentication.
- **Car Management**:
  - Add, update, or delete car listings with details like model, price, and location.
  - Search and sort cars by model, brand, price, and location.
- **Booking System**:
  - Real-time availability tracking and booking management.
  - View, modify, or cancel bookings via the **My Bookings** page.
- **Data Visualization**:
  - Visualize booking cost breakdowns using **Chart.js** and **React-Chartjs-2** for insights.

---

## Authentication

- **Login/Signup**: Secure Firebase authentication using email/password or Google Sign-In.
- **Protected Routes**: Pages like "My Bookings" and "My Cars" are restricted to authenticated users only.
- **JWT Security**: Ensures secure access to private routes.

---

## Application Structure

### Frontend

- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Dynamic Pages**:
  - **Car Listings**: View available cars with filtering and sorting options.
  - **My Bookings**: Manage your bookings easily.
  - **My Cars**: Add, update, or delete your car listings.

### Backend

- **Node.js**: Backend logic and API implementation.
- **Express.js**: Handles routes, authentication, and CRUD operations.
- **MongoDB**: Stores user data, car listings, and booking details.

---

## Technologies Used

### Frontend

- ![React](https://img.shields.io/badge/-React-%2361DAFB?logo=react&logoColor=white) React.js
- ![Firebase](https://img.shields.io/badge/-Firebase-%23FFCA28?logo=firebase&logoColor=black) Firebase
- ![Chart.js](https://img.shields.io/badge/-Chart.js-%23FF6384?logo=chartdotjs&logoColor=white) Chart.js
- ![React Router](https://img.shields.io/badge/-React%20Router-%23CA4245?logo=reactrouter&logoColor=white) React Router Dom
- ![Swiper.js](https://img.shields.io/badge/-Swiper.js-%23000000?logo=swiper&logoColor=white) Swiper.js

### Backend

- ![Node.js](https://img.shields.io/badge/-Node.js-%23339933?logo=node.js&logoColor=white) Node.js
- ![Express.js](https://img.shields.io/badge/-Express.js-%23000000?logo=express&logoColor=white) Express.js
- ![MongoDB](https://img.shields.io/badge/-MongoDB-%2347A248?logo=mongodb&logoColor=white) MongoDB

### Hosting

- ![Firebase Hosting](https://img.shields.io/badge/-Firebase-%23FFCA28?logo=firebase&logoColor=black) Firebase Hosting
- ![Surge](https://img.shields.io/badge/-Surge-%2300BBCF?logo=surge&logoColor=white) Surge
- ![Netlify](https://img.shields.io/badge/-Netlify-%2300C7B7?logo=netlify&logoColor=white) Netlify

---

## 🛠️ Dependencies

Below are the key dependencies used in the project:

- **animate.css**: ^4.1.1
- **axios**: ^1.7.9
- **chart.js**: ^4.4.7
- **firebase**: ^11.1.0
- **react**: ^18.3.1
- **react-chartjs-2**: ^5.2.0
- **react-datepicker**: ^7.5.0
- **react-dom**: ^18.3.1
- **react-dropzone**: ^14.3.5
- **react-helmet**: ^6.1.0
- **react-icons**: ^5.4.0
- **react-router-dom**: ^7.1.0
- **react-toastify**: ^11.0.2
- **sweetalert2**: ^11.15.3
- **swiper**: ^11.1.15

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```
https://github.com/Raiyan27/Car-rental-website.git
```

### 2. Navigate to the Project Directory

```
cd <your-folder-name>
```

### 3. Install dependencies

```
npm install
```

## 4. Set Up Environment Variables

Create a `.env` file in the directory.

```
VITE_FIREBASE_API_KEY=AIzaSyCKne08r0AxGhviswP5ot3C4xr3rK5Xwms
VITE_FIREBASE_AUTH_DOMAIN=gari-chai-27.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gari-chai-27
VITE_FIREBASE_STORAGE_BUCKET=gari-chai-27.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=650587071323
VITE_FIREBASE_APP_ID=1:696659850349:web:41d0d83685e2c7cce87b64
```

5. Run the Frontend Application
   Start the frontend application:

```
npm run dev
```

## 🔧 Additional Notes

Make sure you have Node.js and npm installed on your machine. You can download them from Node.js.
Ensure your MongoDB database is running locally or hosted on a cloud service like MongoDB Atlas.
For Firebase configuration, set up a Firebase project and obtain the necessary credentials from the Firebase Console.

## The server API address:

```
https://gari-chai-server.vercel.app/
```

## The trusted-gamer-gg-server Repository:

https://github.com/Raiyan27/Car-rental-website-server

Now you are all set to explore the Gari Chai Car Rental System locally! 🚗

## Conclusion

Gari Chai is a modern car rental platform created with MERN stack that allows users to seamlessly book, manage, and list cars for rental. Built with cutting-edge technologies, the system offers a responsive design, secure authentication, and efficient inventory management.

---

### Additional Sections:

- **How to Contribute**: If you want to contribute, contact me at abdullahalraiyan4@gmal.com.
