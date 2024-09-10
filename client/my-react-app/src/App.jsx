import React from 'react'
import Header from './Header.jsx';
import GetTasks from './GetTasks.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Login from './Login.jsx';
import Register from "./Register.jsx";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {

  return(
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path = "/tasks" element=
          {
            <PrivateRoute>
              <GetTasks />
            </PrivateRoute>
          }
          />
        <Route path ="/" element={<Navigate to="/tasks" />} />  
      </Routes>
    </Router>
  );
};

export default App;
