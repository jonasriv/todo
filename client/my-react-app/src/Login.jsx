import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); 
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/tasks');
            } else {
                console.error('Login failed', data.message);
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    return (
        <div className="login-div">
            <h2>Logg inn</h2>
            <input className="login-input"
                type="text"
                placeholder="Brukarnamn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input className="login-input"
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />     
            <button className="login-button" onClick={handleLogin}>Logg inn</button>   
            <p className="input-p">
                Hev ikkje brukar? <Link to="/register">Registrer</Link>
            </p>    
        </div>
    );
};

export default Login