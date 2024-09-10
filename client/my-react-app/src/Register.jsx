import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful! Please log in.');
                navigate('/login');
            } else {
                console.error('Registration failed', data.message);
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    };

    return (
        <div className="login-div">
            <h2>Registrer brukar</h2>
    
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
            <button className="login-button" onClick={handleRegister}>Registrer</button>   
            
            <p className="input-p">
                Hev du allereie brukar? <Link to="/login">Logg inn</Link>
            </p>      
        </div>
    );
};

export default Register;