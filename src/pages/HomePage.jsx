import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [userMessage, setUserMessage] = useState('');

    useEffect(() => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            setUserMessage('You are not logged in.');
            return;
        }

        // Use the token to fetch user data or validate the token
        fetch('/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Invalid token or session expired');
                }
                return response.json();
            })
            .then((data) => {
                setUserMessage(`Welcome back, ${data.name || 'User'}!`);
            })
            .catch((error) => {
                console.error(error);
                setUserMessage('Your session has expired. Please log in again.');
            });
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h1 className="text-2xl font-bold text-gray-800">Home Page</h1>
                <p className="mt-4 text-gray-600">{userMessage}</p>
            </div>
        </div>
    );
};

export default HomePage;
