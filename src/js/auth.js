async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async position => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    try {
                        await updateUserLocation(location);
                        resolve(location);
                    } catch (error) {
                        console.error('Error updating location:', error);
                        resolve(null);
                    }
                },
                error => {
                    console.error('Error getting location:', error);
                    resolve(null);
                }
            );
        } else {
            console.error('Geolocation is not supported');
            resolve(null);
        }
    });
}

async function updateUserLocation(location) {
    const response = await fetch(`${API_URL}/users/location`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ location })
    });

    if (!response.ok) {
        throw new Error('Failed to update location');
    }
}

async function register(userData) {
    try {
        console.log('Register request to:', `${window.API_URL}/auth/register`);
        console.log('With data:', userData);

        const response = await fetch(`${window.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Lỗi đăng ký');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

async function login(credentials) {
    try {
        const response = await fetch(`${window.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            console.log('Attempting to register with:', userData);
            const data = await register(userData);
            console.log('Register response:', data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                window.location.href = 'settings.html';
            } else {
                alert('Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Detailed error:', error);
            alert(error.message || 'Đã có lỗi xảy ra khi đăng ký');
        }
    });
}

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const credentials = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const data = await login(credentials);
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                window.location.href = 'profile.html';
            } else {
                alert('Đăng nhập thất bại');
            }
        } catch (error) {
            alert(error.message || 'Đã có lỗi xảy ra khi đăng nhập');
        }
    });
} 