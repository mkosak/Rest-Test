import React from 'react';
import DataTable from './components/DateTable';

import Notification from './components/Notification';

import './App.scss';

function App() {
    return (
        <div className="App">
            <header className="App-header">Test</header>

            <Notification />
            <DataTable />
        </div>
    );
}

export default App;
