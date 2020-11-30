import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

// This context provider is passed to any component requiring the context
export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        type: 'error',
        msg: 'Something goes wrong',
    });

    return (
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
