import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../images/gnet.webp";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usersData from "../database/users.json";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State for login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Handle login input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Login form handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Find user in database
    const user = usersData.users.find(
      (u) => u.email === loginData.email && u.password === loginData.password
    );

    if (!user) {
      toast.error("Invalid email or password!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    console.log("Login successful for:", user);

    // Store user data in context
    if (login) {
      const userData = {
        token: `token-${user.id}-${Date.now()}`,
        role: user.role,
        name: user.name,
        email: user.email,
        userId: user.userId,
        phone: user.phone,
        kycStatus: user.kycStatus || "pending",
      };

      // Add hotelName if user is hotelowner
      if (user.hotelName) {
        userData.hotelName = user.hotelName;
      }

      login(userData);
    }

    // Show success toast
    toast.success(`Welcome ${user.name}! Redirecting...`, {
      position: "top-right",
      autoClose: 2000,
    });

    // Redirect based on role
    setTimeout(() => {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "hotelowner") {
        navigate("/hotelowner-dashboard");
      } else if (user.role === "team") {
        navigate("/hotelowner-dashboard");
      } else {
        navigate("/dashboard");
      }
    }, 2000);
  };

  return (
    <>
      <ToastContainer />
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <div className="login-card">
                  <div className="center-wrap">
                    <div className="section text-center">
                      <h4 className="mb-4 pb-3">Namaste Tech Log In</h4>
                      <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            className="form-style"
                            placeholder="Your Email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                          />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input
                            type="password"
                            name="password"
                            className="form-style"
                            placeholder="Your Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <button type="submit" className="btn mt-4">
                          Login
                        </button>
                      </form>
                      {/* <p className="mb-0 mt-4 text-center">
                        <a href="#0" className="link">
                          Forgot your password?
                        </a>
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
