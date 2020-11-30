import React, { useReducer, useContext, useEffect } from 'react';
import { NotificationContext } from './../Notification/NotificationContext';
import { api } from './../../api';

import reducer from './reducer';
import DataTableRowSkeleton from './DataTableRowSkeleton';
import DataTableRow from './DataTableRow';

import './style.scss';

const DataTable = () => {
    const notification = useContext(NotificationContext);
    const initialState = {
        results: [],
        fetched: false,
        loading: false,
        calcTotal: '...',
        error: '',
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchTransactions = async () => {
        dispatch({ type: 'loading', payload: true });

        let results = []; // final response data
        const pageToStart = 1; // assuming that we have 1 page anyway in response
        const promisesData = [];

        try {
            const response = await api.get(`/${pageToStart}.json`);
            const totalTrans = response.data.totalCount;
            const totalPages = Math.ceil(
                totalTrans / response.data.transactions.length
            );

            // collect data from the intial response
            results = response.data.transactions;

            // initiate additional responses based on the total data
            for (let i = pageToStart + 1; i < totalPages + 1; i++) {
                promisesData.push(api.get(`/${i}.json`));
            }

            let resolvedData = await Promise.all(promisesData);
            for (let i = 0; i < resolvedData.length; i++) {
                // This is the output of each request call
                results = results.concat(resolvedData[i].data.transactions);
            }

            // store the data once everything is fetched
            dispatch({ type: 'results', payload: results });

            // change app state
            dispatch({ type: 'fetched', payload: true });
            dispatch({ type: 'loading', payload: false });
        } catch (err) {
            dispatch({ type: 'error', payload: err });
        }
    };

    useEffect(() => {
        //fetchTransactions();
    }, []);

    // useEffect(() => {
    //     state.results.map(item => item.
    // }, [state.results]);

    useEffect(() => {
        if (state.error) {
            console.log('show notif', state.error);
            notification.setNotification({
                type: 'error',
                msg:
                    state.error &&
                    state.error.response &&
                    state.error.response.data,
            });
        }
    }, [state.error, notification]);

    return (
        <React.Fragment>
            {state.results.length ? (
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
                                {state.calcTotal}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {state.loading ? (
                            <DataTableRowSkeleton />
                        ) : (
                            <DataTableRow results={state.results} />
                        )}
                    </tbody>
                </table>
            ) : state.fetched && !state.loading ? (
                <p style={{ textAlign: 'center' }}>No transactions</p>
            ) : null}
        </React.Fragment>
    );
};

export default DataTable;
