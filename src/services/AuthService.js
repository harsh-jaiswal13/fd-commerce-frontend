const apiBaseUrl = 'http://localhost:3000/auth';

export const authService = {
    login: async (data) => {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }
        return result;
    },

    register: async (data) => {
        const response = await fetch(`${apiBaseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        localStorage.setItem('jwtToken', result.token);
        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }
        return result;
    },
};
