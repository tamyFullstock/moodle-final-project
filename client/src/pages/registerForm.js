import React, { useState, useEffect } from 'react';
import '../style/pages/registerForm.css'
import { useSetAuth } from '../helpers/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';
import showErrorMessage from '../helpers/alertMessage';
import Globals from '../Globals';

function RegisterForm() {
    const port = Globals.PORT_SERVER;
    const navigate = useNavigate();
    const setAuth = useSetAuth();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") ?? {})); 

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user") ?? {}));
        if (user == {}) {
            setAuth(false);
        } 
        setUser({ ...user, type: "student" });
    }, []);

    async function saveUserServer() {  
        const response = await fetch(`http://localhost:${port}/users/${user.id}`, {
            method: 'PUT',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...user, status: 1 })
        });
        if (!response.ok) {
            if (response.status === 400) {
                const data = await response.json();
                throw new Error(data.message);
            }
            throw new Error("Error while trying to sign user, please try again");
        }
    }

    async function handleSubmit(e) { 
        e.preventDefault();
        try {
            await saveUserServer();
            localStorage.setItem("user", JSON.stringify({ ...user, status: 1 }));
            navigate("/");
        } catch (err) {
            showErrorMessage(err.message);
        }
    }

    return (
        <div className='register-container'>
            <form className="register-form-container">

                <div className="register-form-title">
                    <h1>Complete Your Details</h1>
                </div>

                <div className="register-cols-container">
                    <div className="register-first-col">
                        <div className="register-input-item-container">
                            <label className="register-label">First Name</label>
                            <input 
                                className="register-input" 
                                name="first_name"
                                onChange={e => setUser({ ...user, first_name: e.target.value })}
                                type="text" 
                                required 
                            />
                        </div>

                        <div className="register-input-item-container">
                            <label className="register-label">Last Name</label>
                            <input 
                                className="register-input" 
                                name="last_name"
                                onChange={e => setUser({ ...user, last_name: e.target.value })}
                                type="text" 
                                required 
                            />
                        </div>

                        <div className="register-input-item-container">
                            <label className="register-label">Email</label>
                            <input 
                                className="register-input" 
                                name="email"
                                onChange={e => setUser({ ...user, email: e.target.value })}
                                type="text" 
                                required 
                            />
                        </div>

                        <div className="register-input-item-container">
                            <label className="register-label">Address</label>
                            <input 
                                className="register-input" 
                                name="address"
                                onChange={e => setUser({ ...user, address: e.target.value })}
                                type="text" 
                                required 
                            />
                        </div>

                        <div className="register-input-item-container">
                            <label className="register-label">Phone Number</label>
                            <input 
                                className="register-input" 
                                name="phone"
                                onChange={e => setUser({ ...user, phone: e.target.value })}
                                type="text" 
                                required 
                            />
                        </div>

                        <div className="register-input-item-container">
                            <label htmlFor="userRole" className="register-label">Choose Your Role:</label>
                            <select
                                onChange={e => setUser({ ...user, type: e.target.value })}
                                className="register-input" 
                                id="userRole">
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                            </select>
                        </div>
                        
                    </div>

                </div>
               
                <button onClick={handleSubmit} className="register-button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;