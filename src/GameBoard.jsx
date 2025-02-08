import React from 'react';
import './GameBoard.css';

export function GameBoard({ keyword, onGuess, gameOver }) {
    const [currentGuess, setCurrentGuess] = React.useState('');
    const [guessHistory, setGuessHistory] = React.useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentGuess.length !== keyword.length) {
            alert(`Please enter a ${keyword.length}-letter word!`);
            return;
        }

        const newGuess = {
            word: currentGuess.toLowerCase(),
            feedback: getCurrentGuessFeedback(currentGuess.toLowerCase())
        };

        setGuessHistory([...guessHistory, newGuess]);
        onGuess(currentGuess.toLowerCase());
        setCurrentGuess('');
    };

    const getCurrentGuessFeedback = (guess) => {
        return guess.split('').map((letter, index) => ({
            letter,
            status: checkLetter(letter, index)
        }));
    };

    const checkLetter = (letter, index) => {
        if (letter === keyword[index]) return '🟢';
        if (keyword.includes(letter)) return '🟡';
        return '🔴';
    };

    return (
        <div className="game-board">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    disabled={gameOver}
                    maxLength={keyword.length}
                    placeholder={`Enter ${keyword.length} letter word`}
                    className="guess-input"
                />
                <button type="submit" disabled={gameOver} className="guess-button">
                    Guess
                </button>
            </form>

            <div className="guess-history">
                {guessHistory.map((guess, index) => (
                    <div key={index} className="guess-row">
                        {guess.feedback.map((item, letterIndex) => (
                            <span key={letterIndex} className="letter-feedback">
                {item.letter}{item.status}
              </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}