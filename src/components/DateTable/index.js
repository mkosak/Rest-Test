import { compose } from 'recompose';
import React, { useReducer, useEffect } from 'react';
import reducer from './reducer';
import withTransactionsApi from './../hocs/withTransactionsApi';
import DataTableRow from './DataTableRow';
import DataTableRowSkeleton from './DataTableRowSkeleton';

import './style.scss';

const DataTable = (props) => {
    const { transactions, loading } = props;
    const initialState = {
        fetched: false,
        loading: false,
        calcTotal: '...',
        error: '',
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    // Calculate total for all transactions once loaded
    useEffect(() => {
        let total = 0;
        transactions.forEach((item) => (total += item.Amount * 1));

        dispatch({ type: 'calcTotal', payload: total });
    }, [transactions]);

    return (
        <React.Fragment>
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
                    {loading ? (
                        <DataTableRowSkeleton />
                    ) : transactions.length ? (
                        <DataTableRow results={transactions} />
                    ) : state.fetched && !loading ? (
                        <p style={{ textAlign: 'center' }}>No transactions</p>
                    ) : null}
                </tbody>
            </table>
        </React.Fragment>
    );
};

export default compose(withTransactionsApi)(DataTable);
