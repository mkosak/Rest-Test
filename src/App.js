import React from 'react';
import DataTable from './components/DateTable';
import Notification from './components/Notification';

import './App.scss';

function App() {
    return (
        <div className="App">
            <header className="header">Rest Test</header>

            <Notification />

            <div className="page">
                <DataTable />
            </div>
        </div>
    );
}

export default App;
