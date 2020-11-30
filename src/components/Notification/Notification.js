import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { NotificationContext } from './NotificationContext';

export default function Notification() {
    const { notification } = useContext(NotificationContext);
    const [show, setShow] = useState(false);
    const notificationClassName = classNames(
        'notification',
        `notification--${notification.type}`,
        {
            'notification--show': show,
        }
    );

    useEffect(() => {
        setShow(true);

        const timer = setTimeout(() => {
            setShow(false);
        }, 3000); // delay of the notification in milliseconds

        return () => clearTimeout(timer);
    }, [notification]);

    return <div className={notificationClassName}>{notification.msg}</div>;
}
