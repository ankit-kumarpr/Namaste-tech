# Login Credentials

## 🎯 Master Admin
**Email:** `admin@hotel.com`  
**Password:** `admin123`

## 🏨 Hotel Owner (Hotelier)
**Email:** `hotelier@hotel.com`  
**Password:** `hotelier123`

**Email:** `hotelier2@hotel.com`  
**Password:** `hotelier123`

## 👥 Team Member
**Email:** `team@hotel.com`  
**Password:** `team123`

---

## Features:
✅ Simple login-only page (no registration)  
✅ Common login page for all user types  
✅ Role-based authentication  
✅ Automatic dashboard redirection based on role  
✅ JSON database for user management  
✅ No API calls - Pure UI with mock authentication  
✅ Clean and modern UI

## Role-Based Navigation:
- **Admin** → Admin Dashboard
- **Hotel Owner** → Hotel Owner Dashboard  
- **Team Member** → Hotel Owner Dashboard (Limited Access)

## Login Flow:
1. Enter email and password
2. System validates against JSON database
3. On success, redirects to appropriate dashboard
4. Shows welcome message with user name

## Note:
- Registration form has been removed for security
- All user accounts are pre-configured in JSON database

