import React from 'react'; 
import { Link } from 'react-router-dom';


function Header() {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };
    return(
        <header>
            <div className="title-box">
            <img class="header-img" src='/kvagjere.svg'></img>
            </div>

        </header>
    );
};

export default Header