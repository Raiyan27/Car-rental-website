# 🚗 Gari Chai - Car Rental System

**Live URL**: (#)
Firebase: https://gari-chai-27.web.app/
Surge: https://gari-chai.surge.sh/

## 🌟 Project Overview

**Gari Chai** is a modern car rental platform created with MERN stack that allows users to seamlessly book, manage, and list cars for rental. Built with cutting-edge technologies, the system offers a responsive design, secure authentication, and efficient inventory management.

---

## 🛠️ Features

### 🔑 User Authentication

- **Login and Registration**: Users can register and log in with Firebase Email/Password or Google authentication. Firebase is used to ensure secure authentication and manage user sessions.
- **JWT Protection**: Private routes are secured using JWT-based authentication, ensuring that only authenticated users can access certain pages like "My Bookings" and "My Cars."

### 🚗 Car Management

- **Add Cars**: Authenticated users can list cars for rental, providing details such as car model, price, and location. This is handled with a simple and intuitive form.
- **Update/Delete Cars**: Users have the ability to update or delete their listed cars, ensuring they maintain control over their inventory.
- **Search & Sorting**: Users can search for cars based on model, brand, and location, with sorting options for price and date.

### 📅 Booking System

- Book cars with real-time availability tracking. The system updates car availability dynamically to provide the most up-to-date information.
- Users can view, modify, or cancel bookings directly from the **My Bookings** page.

### 📊 Data Visualization Feature

- Visualize the share of total cost taken by different car's booking data using **Chart.js** and **React-Chartjs-2**. This gives users insights into car their booked cars.

---

## 🖥️ Technologies Used

### Frontend

The frontend of **Gari Chai** is built using **React.js**, a component-based library that makes it easy to create interactive and dynamic user interfaces. The frontend includes several key features for better user experience:

- **React Router Dom** is used to handle seamless navigation between different pages, such as the home page, available cars, and user profiles.
- For authentication, **Firebase** is used to manage user login, registration, and session persistence. Firebase also allows users to authenticate using Google Sign-In or email/password.
- **Chart.js** and **React-Chartjs-2** are integrated for real-time data visualization. These libraries help create interactive graphs that show booking trends and other important statistics.
- **React Toastify** and **SweetAlert2** are used to display notifications and alert messages to users, making the experience more engaging.
- **Swiper.js** enhances the user interface with smooth and interactive carousels for showcasing cars and offers.
- For smooth animations, **Animate.css** is used to add animations when the user interacts with the interface.
- **React Dropzone** allows users to easily upload images for car listings.
- **React Helmet** dynamically manages the document head, allowing for better SEO and more efficient use of metadata across different pages.

Here is a list of key frontend dependencies:

- animate.css: ^4.1.1
- axios: ^1.7.9
- chart.js: ^4.4.7
- firebase: ^11.1.0
- lottie-react: ^2.4.0
- react: ^18.3.1
- react-chartjs-2: ^5.2.0
- react-datepicker: ^7.5.0
- react-dom: ^18.3.1
- react-dropzone: ^14.3.5
- react-helmet: ^6.1.0
- react-icons: ^5.4.0
- react-lottie: ^1.2.10
- react-router-dom: ^7.1.0
- react-toastify: ^11.0.2
- sweetalert2: ^11.15.3
- swiper: ^11.1.15

## Conclusion

Gari Chai offers a seamless platform for users to rent and list cars, featuring real-time updates and interactive dashboards. Whether you are renting a car or managing your fleet, the system is designed to meet your needs with efficiency and simplicity.
