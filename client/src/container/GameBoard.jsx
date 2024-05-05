import GuessLine from "./GuessLine";

export default function GameBoard({ guesses, currentGuess }) {
  return (
    <div className="game-area">
      <div className="board">
        {guesses.map((guess, i) => (
          <GuessLine
            key={i}
            guess={guess}
            isCurrentGuess={i === currentGuess - 1}
          />
        ))}
      </div>
    </div>
  );
}
