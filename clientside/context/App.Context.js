import React, { createContext, useState } from 'react';


export const AuthenticationContext = createContext();


const AppContext = ({ children }) => {

    const [user, setUser] = useState({
        username: '',
        fullName: '',
        dateOfBirth: '',
        role: '',
        avatar: '',
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [token, setToken] = useState('');
    // const checkAuthentication = async () => {
    //     const response = await get('/auth/', token);
    //     if (response.status === 401) {
    //         logout();
    //     }
    //     else {
    //         const { username, fullName, dateOfBirth, role, avatar } = response.data;
    //         setUser({ ...user, username, fullName, dateOfBirth, role, avatar: avatar.imageUrl });
    //     }
    // };



    const logout = () => {
        setUser({
            username: '',
            fullName: '',
            dateOfBirth: '',
            role: '',
            avatar: '',
        });
        setToken('');
        setIsLoggedIn(false);
    };

    return (
        <AuthenticationContext.Provider value={{ user, token, isLoggedIn, logout, setUser }}>
            {children}
        </AuthenticationContext.Provider>
    );
};


export default AppContext;
