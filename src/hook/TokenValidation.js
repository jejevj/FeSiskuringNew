import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SweetAlert from '../components/alerts/swal';

const useTokenValidation = (

    apiBaseUrl = process.env.REACT_APP_API_BASE_URL, loginPath = '/login') => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('access_token');
            const refresh = localStorage.getItem('refresh_token');
            if (!refresh) {
                SweetAlert.showAlert("Belum Login", "Silahkan Login Terlebih Dahulu", "error", "Tutup");
                navigate(loginPath, { replace: true });
            } else {
                try {
                    const response = await fetch(`${apiBaseUrl}/api/auth/profile/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const profileData = await response.json();
                        // localStorage.setItem('msg', "101"); //Profil Di Load
                        localStorage.setItem('userProfile', JSON.stringify(profileData));
                    } else if (response.status === 401) {

                        //it should be logout if 401, but alert first that session has been ended
                        // refresh is outside
                        // Token expired, try to refresh it
                        if (refresh) {
                            try {
                                const refreshResponse = await fetch(`${apiBaseUrl}/api/auth/token/refresh/`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ refresh: refresh }),
                                });

                                if (refreshResponse.ok) {
                                    const refreshData = await refreshResponse.json();
                                    // Update local storage with the new access token
                                    localStorage.setItem('access_token', refreshData.access);
                                    localStorage.setItem('msg', "102"); //Token Berhasil
                                    // Optionally, you can call the profile endpoint again to get fresh user data
                                    await checkToken(); // Re-check the token and fetch user profile again
                                } else {
                                    // If refreshing fails, remove tokens and navigate to login
                                    localStorage.removeItem('access_token');
                                    localStorage.removeItem('refresh_token');
                                    navigate(loginPath, { replace: true });
                                }
                            } catch (error) {
                                console.error('Error refreshing token:', error);
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('refresh_token');
                                navigate(loginPath, { replace: true });
                            }
                        } else {
                            // If there's no refresh token, navigate to login
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            navigate(loginPath, { replace: true });
                        }
                    }
                } catch (error) {
                    console.error('Error checking token:', error);
                    SweetAlert.showAlert("Belum Login", "Silahkan Login Terlebih Dahulu", "errorr", "Tutup")
                }
            }
            // if (token) {

            // }
        };

        checkToken();
    }, [navigate, apiBaseUrl, loginPath]);
};

export default useTokenValidation;
