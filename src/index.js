import React from 'react';
import ReactDOM from 'react-dom';
import { NotificationProvider } from './components/Notification/NotificationContext';
import App from './App';

import './index.scss';

ReactDOM.render(
    <React.StrictMode>
        <NotificationProvider>
            <App />
        </NotificationProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
