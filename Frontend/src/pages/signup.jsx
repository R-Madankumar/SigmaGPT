import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import server from '../envirnoment';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/register`, formData);
            setMessage("Registration successful!");
            // Navigate to login page after successful registration
            setTimeout(() => {
                navigate('/login');
            }, 1500); // Wait 1.5 seconds so user can see success message
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <div className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</div>}
        </div>
    );
};

export default Signup;
