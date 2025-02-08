// Wordle.jsx
import React, { useState, useEffect } from 'react';
import './Wordle.css';

function Wordle() {
    const [keyword, setKeyword] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const MAX_ATTEMPTS = 6;
    const WORD_LENGTH = 5;

    useEffect(() => {
        loadWord();
    }, []);

    const loadWord = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('./words.txt');
            const data = await response.text();

            const words = data.split('\n')
                .map(word => word.trim().toLowerCase())
                .filter(word => word.length === WORD_LENGTH && /^[a-z]+$/.test(word));

            if (words.length === 0) {
                throw new Error('No valid 5-letter words found');
            }

            const randomWord = words[Math.floor(Math.random() * words.length)];
            setKeyword(randomWord);
            resetGame();
        } catch (error) {
            console.error('Error loading words:', error);
            const fallbackWords = ['dream', 'light', 'peace', 'smart', 'brave'];
            const randomWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
            setKeyword(randomWord);
            resetGame();
        } finally {
            setIsLoading(false);
        }
    };

    const resetGame = () => {
        setGuesses([]);
        setCurrentGuess('');
        setGameOver(false);
        setMessage('');
    };

    const handleInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length <= WORD_LENGTH && /^[a-z]*$/.test(value)) {
            setCurrentGuess(value);
        }
    };

    const checkGuess = (guess) => {
        const guessArray = guess.split('');
        const keywordArray = keyword.split('');
        const result = Array(WORD_LENGTH).fill('absent');

        // First check for correct letters in correct positions
        guessArray.forEach((letter, index) => {
            if (letter === keywordArray[index]) {
                result[index] = 'correct';
                keywordArray[index] = null; // Mark as used
            }
        });

        // Then check for correct letters in wrong positions
        guessArray.forEach((letter, index) => {
            if (result[index] !== 'correct') {
                const keywordIndex = keywordArray.indexOf(letter);
                if (keywordIndex !== -1) {
                    result[index] = 'present';
                    keywordArray[keywordIndex] = null; // Mark as used
                }
            }
        });

        return result;
    };

    const handleSubmitGuess = () => {
        if (currentGuess.length !== WORD_LENGTH) {
            setMessage(`Please enter a ${WORD_LENGTH}-letter word`);
            return;
        }

        const newGuess = {
            word: currentGuess,
            result: checkGuess(currentGuess)
        };

        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === keyword) {
            setMessage('Congratulations! You won! 🎉');
            setGameOver(true);
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setMessage(`Game Over! The word was: ${keyword}`);
            setGameOver(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !gameOver) {
            handleSubmitGuess();
        }
    };

    if (isLoading) {
        return <div className="wordle-container">Loading...</div>;
    }

    return (
        <div className="wordle-container">
            <h2>Attempts remaining: {MAX_ATTEMPTS - guesses.length}</h2>

            {/* Game Board */}
            <div className="game-board">
                {/* Previous Guesses */}
                {guesses.map((guess, i) => (
                    <div key={i} className="guess-row">
                        {guess.word.split('').map((letter, j) => (
                            <div key={j} className={`letter-box ${guess.result[j]}`}>
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}

                {/* Current Guess */}
                {!gameOver && guesses.length < MAX_ATTEMPTS && (
                    <div className="guess-row">
                        {currentGuess.split('').map((letter, i) => (
                            <div key={i} className="letter-box">{letter}</div>
                        ))}
                        {[...Array(WORD_LENGTH - currentGuess.length)].map((_, i) => (
                            <div key={i + currentGuess.length} className="letter-box"></div>
                        ))}
                    </div>
                )}

                {/* Empty Rows */}
                {[...Array(MAX_ATTEMPTS - guesses.length - (!gameOver ? 1 : 0))].map((_, i) => (
                    <div key={i + guesses.length} className="guess-row">
                        {[...Array(WORD_LENGTH)].map((_, j) => (
                            <div key={j} className="letter-box"></div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            {!gameOver && (
                <div className="input-area">
                    <input
                        type="text"
                        className="guess-input"
                        value={currentGuess}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        maxLength={WORD_LENGTH}
                        placeholder={`Enter ${WORD_LENGTH}-letter word`}
                        autoFocus
                    />
                    <button
                        className="submit-button"
                        onClick={handleSubmitGuess}
                        disabled={currentGuess.length !== WORD_LENGTH}
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* Message and New Game Button */}
            {message && <p className="message">{message}</p>}
            {gameOver && (
                <button className="new-game-button" onClick={loadWord}>
                    New Game
                </button>
            )}
        </div>
    );
}

export default Wordle;