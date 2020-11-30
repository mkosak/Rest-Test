import React, { useContext, useEffect, useState } from 'react';
import { useApi } from '../../hooks';
import { NotificationContext } from './../Notification/NotificationContext';

import DataTableRow from './DataTableRow';
import './style.scss';

const DataTable = () => {
    const [dataInitResponse, dataInitRequest] = useApi('get', '0.json');
    const { data, error, pending } = dataInitResponse;
    const results = (data && data.vacations) || [];
    const notification = useContext(NotificationContext);
    const [fetched, setFetched] = useState(false);
    /// const totalCount = (data && data.totalCount) || 1;

    // const [total, setTotal] = useState(false);

    useEffect(() => {
        if (error) {
            notification.setNotification({
                type: 'error',
                msg: error && error.response && error.response.data,
            });
        }
    }, [error]);

    useEffect(() => {
        dataInitRequest();
        setFetched(true);
    }, []);

    // useEffect(() => {
    //     console.log(totalCount);
    // }, [totalCount]);

    return (
        <div>
            {pending && 'Loading'}

            {results.length ? (
                <table className="data-table">
                    <thead>
                        <tr className="data-table__row">
                            <td className="data-table__cell data-table__cell--heading">
                                Date
                            </td>
                            <td className="data-table__cell data-table__cell--heading">
                                Company
                            </td>
                            <td className="data-table__cell data-table__cell--heading">
                                Account
                            </td>
                            <td className="data-table__cell data-table__cell--heading">
                                Total
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <DataTableRow results={results} loading={pending} />
                    </tbody>
                </table>
            ) : fetched && !pending ? (
                <p style={{ textAlign: 'center' }}>No results</p>
            ) : null}
        </div>
    );
};

export default DataTable;
