# User and Group Management System  

This project is a **User and Group Management System** built with a focus on **role-based access control (RBAC)**. It allows administrators, managers, and other users to interact with the application according to their assigned roles.  

## Live Demo  
The application is deployed on **Vercel**. [https://erasmithassignment.vercel.app/](#) .  

## Technology Stack  
### Frontend  
- **React** with **Vite**  
- **TailwindCSS** for styling  

### Backend  
- **Node.js** with **Express**  

### Database  
- **MongoDB**  

### Hosting  
- **Vercel**  

## Features  
### User Roles  
1. **Admin**  
   - Full control over all functionalities.  
   - Can create, edit, and delete users.  
   - Can create, edit, and delete groups.  

2. **Manager**  
   - Limited control.  
   - Can view and create new users.  
   - No access to group management.  

3. **Other Users**  
   - View-only access to user details.  

### Functionalities  
- **User Management**: Create, view, edit, and delete users (based on role permissions).  
- **Group Management**: Admins can create, edit, and delete groups with assigned roles.  
- **Role-Based Access Control**: Users can interact with the application according to their role.  

## Installation  

### Prerequisites  
Make sure you have the following installed on your system:  
- Node.js  
- MongoDB  

### Steps to Run Locally  
1. Clone the repository:  
   ```bash
   git clone <repository-url>
   cd <repository-name>

2. Install dependencies for both frontend and backend:
