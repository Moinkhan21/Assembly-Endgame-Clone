import React, { useState } from 'react';
import { languages } from '../languages'; // Array of language objects (with name, backgroundColor, etc.)
import clsx from 'clsx'; // Utility for conditionally joining classNames
import { getFarewellText, getRandomWord } from '../utils'; // Utility functions
import Confetti from 'react-confetti'; // Confetti animation component

const Main = () => {
  // ========================
  // 1️⃣ STATE VARIABLES
  // ========================

  // Random word to guess, generated at the start of the game
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());

  // Stores all letters the player has guessed so far
  const [guessedLetters, setGuessedLetters] = useState([]);

  // ========================
  // 2️⃣ DERIVED VALUES
  // ========================

  // Max number of wrong guesses allowed (1 less than the number of languages)
  const numGuessesLeft = languages.length - 1;

  // Count of incorrect guesses made
  const wrongGuessesCount = guessedLetters.filter(
    letter => !currentWord.includes(letter)
  ).length;

  // Check if all letters of the word have been guessed
  const isGameWon = currentWord
    .split('')
    .every(letter => guessedLetters.includes(letter));

  // Check if wrong guesses exceed the limit
  const isGameLost = wrongGuessesCount >= numGuessesLeft;

  // Overall game status (either won or lost)
  const isGameOver = isGameWon || isGameLost;

  // Get the most recent guessed letter
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

  // Check if last guess was incorrect
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // ========================
  // 3️⃣ CONSTANTS
  // ========================

  // Alphabet to render the keyboard
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  // ========================
  // 4️⃣ EVENT HANDLERS
  // ========================

  // Add a guessed letter if it hasn't already been guessed
  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  // Restart the game with a new word and empty guess list
  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  // ========================
  // 5️⃣ RENDERING UI ELEMENTS
  // ========================

  // 🔤 Language chips representing remaining chances
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessesCount;

    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };

    const className = clsx("chip", isLanguageLost && "lost");

    return (
      <span key={lang.name} className={className} style={styles}>
        {lang.name}
      </span>
    );
  });

  // 🔡 Word display with blank or revealed letters
  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter =
      isGameLost || guessedLetters.includes(letter);

    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    );

    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  // ⌨️ Keyboard buttons to guess letters
  const keyboardElements = alphabet.split('').map(letter => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        key={letter}
        className={className}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  // Dynamic class for game status area
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  // ✨ Renders messages based on game progress
  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessesCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😂</p>
        </>
      );
    }

    return null;
  }

  // ========================
  // 6️⃣ JSX OUTPUT
  // ========================

  return (
    <main>
      {/* 🎉 Confetti effect when player wins */}
      {isGameWon && (
        <Confetti 
          recycle={false} 
          numberOfPieces={1000} 
        />
      )}

      {/* 🧠 Game Title and Instructions */}
      <header>
        <h1>Assembly Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep 
          the programming world safe from Assembly
        </p>
      </header>

      {/* 🟠 Game Status Area */}
      <section
        className={gameStatusClass}
        aria-live="polite"
        role="status"
      >
        {renderGameStatus()}
      </section>

      {/* 💬 Language Chips as Life Indicators */}
      <section className="language-chips">
        {languageElements}
      </section>

      {/* 🔤 Revealed Word Section */}
      <section className="word">
        {letterElements}
      </section>

      {/* ♿ Screen reader-friendly text describing status */}
      <section
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry! The letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map(letter =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>

      {/* ⌨️ Keyboard for guessing letters */}
      <section className="keyboard">
        {keyboardElements}
      </section>

      {/* 🔁 Show "New Game" button when game ends */}
      {isGameOver && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  );
};

export default Main;
