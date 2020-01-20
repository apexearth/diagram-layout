import React from 'react';
import './App.css';
import node from './node'

const App: React.FC = () => {
    const data = node;
    setImmediate(() => document.getElementById('app')!.appendChild(data));
    return (
        <div id={'app'}>
        </div>
    );
};

export default App;
