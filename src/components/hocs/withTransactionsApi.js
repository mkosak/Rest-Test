import React from 'react';
import PropTypes from 'prop-types';
import { api } from './../../api';
import { NotificationContext } from './../Notification/NotificationContext';

export default function withTransactionsApi(Component) {
    return class WithTransactionsApi extends React.Component {
        static propTypes = {
            notification: PropTypes.func,
        };

        static defaultProps = {
            notification: () => {},
        };

        static contextType = NotificationContext;

        state = {
            transactions: [],
            loading: true,
        };

        componentDidMount() {
            this.fetchTransactions();
        }

        fetchTransactions = async (success, error) => {
            const notification = this.context;

            let transactions = []; // final response data
            const pageToStart = 1; // assuming that we have 1 page anyway in response
            const promisesData = [];

            await api
                .get(`/${pageToStart}.json`)
                .then(async (response) => {
                    if (typeof success === 'function') {
                        console.log('here');
                        success(transactions);
                    } else {
                        console.log('there');
                        // calculate how many pages we have
                        const totalTrans = response.data.totalCount;
                        const totalPages = Math.ceil(
                            totalTrans / response.data.transactions.length
                        );

                        // collect data from the intial response
                        transactions = response.data.transactions;

                        // initiate additional responses based on the total data
                        for (let i = pageToStart + 1; i < totalPages + 1; i++) {
                            // assuming the API alwasy have last page even with 1 transaction
                            promisesData.push(api.get(`/${i}.json`));
                        }

                        let resolvedData = await Promise.all(promisesData);
                        for (let i = 0; i < resolvedData.length; i++) {
                            // This is the output of each request call
                            transactions = transactions.concat(
                                resolvedData[i].data.transactions
                            );
                        }

                        this.setState({ transactions, loading: false });
                    }
                })
                .catch((thrown) => {
                    if (typeof error === 'function') {
                        error(thrown);
                    } else {
                        // Show error notification
                        notification.setNotification({
                            type: 'error',
                            msg: error && error.response && error.response.data,
                        });
                        console.error(error);
                        this.setState({ loading: false });
                    }
                });
        };

        render() {
            const { loading, transactions } = this.state;

            return (
                <Component
                    {...this.props}
                    loading={loading}
                    transactions={transactions}
                />
            );
        }
    };
}
