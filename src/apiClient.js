import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("at apiClient");
        const originalRequest = error.config;
        console.log(originalRequest);

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            try {
                const newTokens = await refreshAccessToken(refreshToken);
                localStorage.setItem('refresh_token', newTokens.refresh);
                localStorage.setItem('access_token', newTokens.access);
                originalRequest.headers['Authorization'] = 'Bearer ' + newTokens.access;
                return apiClient(originalRequest);
            } catch (err) {
                console.log('Token refresh failed', err);
            }
        }

        return Promise.reject(error);
    }
);

async function refreshAccessToken(refreshToken) {
    console.log("refresh token at refAccess:" + refreshToken);
    const response = await fetch('http://localhost:8000/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken })
    });
    console.log(response.status);

    if (response.ok) {
        const data = await response.json();
        console.log("at refAccess:" + data.access + "\nref" + data.refresh);
        return data;  // Return the new access token
    } else {
        throw new Error('Failed to refresh token');
    }
}

export default apiClient;