import React from 'react';
import Wordle from './Wordle';
import './App.css';  // Add this import

function App() {
    return (
        <div className="App">
            <h1>Wordle Game</h1>
            <Wordle />
        </div>
    );
}

export default App;