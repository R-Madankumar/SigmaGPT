import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import server from '../envirnoment';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/api/login`, formData);
            setMessage("Login successful!");
            console.log("Token:", response.data.token);
            localStorage.setItem("token", response.data.token);
            // Navigate to home page after successful login
            navigate('/');        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
            {message && <div className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</div>}
        </div>
    );
};

export default Login;
