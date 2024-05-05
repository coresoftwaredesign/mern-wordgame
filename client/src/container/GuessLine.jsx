import WordGame from "./WordGame";

// render one line / guess
export default function GuessLine({ guess, isCurrentGuess }) {
  const tiles = [];
  for (let i = 0; i < WordGame.WORD_LENGTH; i++) {
    let className = "";
    let animationDelay = {};

    let ch = guess.guessText.charAt(i).toUpperCase();

    // only animate tiles w/ characters
    if (ch !== "") {
      if (guess.isDone) {
        // game done - do dance animation
        className = "dance";
        animationDelay = {
          animationDelay: i / 5.0 + "s, " + (1.0 + i / 10.0) + "s",
        };
      } else {
        // setup map match status to css animation
        let matchStatus = guess.matchStatus[i];
        className = WordGame.matchClassMap.get(matchStatus);

        // active line has flip animation added
        if (isCurrentGuess && matchStatus !== WordGame.MatchStatus.Invalid) {
          className = "flip-" + className;
          if (WordGame.isAnimated(matchStatus)) {
            animationDelay = { animationDelay: i / 5.0 + "s" };
          }
        }
      }
    }

    tiles.push(
      <div key={i} className={"tile " + className} style={animationDelay}>
        {ch}
      </div>
    );
  }
  return <>{tiles}</>;
}
