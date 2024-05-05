//
// business logic for validating guesses
//
export const WORD_LENGTH = 5;
const NOT_ENOUGH_LETTERS = "Not enough letters";
const INVALID_GAME_DATE = "Invalid game date";

export const MatchStatus = {
  Invalid: -1,
  Unknown: 0,
  UnMatched: 1,
  InWord: 2,
  Matched: 3,
};

export function validateGuess(guess: string) {
  if (guess === null || !guess.match(/^[a-zA-Z]{5}$/)) {
    return NOT_ENOUGH_LETTERS;
  } else {
    return "";
  }
}

export function validateGameDate(gamedate: string) {
  // validate guess
  if (
    !gamedate.match(/^20(2[4-9]|30)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  ) {
    return INVALID_GAME_DATE;
  } else {
    return "";
  }
}

// main 'wordle' game scoring logic
export function scoreGuess(guess: string, answer: string) {
  const match = Array(WORD_LENGTH).fill(MatchStatus.UnMatched);

  // loop through once, marking exact matches
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      match[i] = MatchStatus.Matched;
    }
  }

  // loop through guess again, look for in-word matches, but skipped letters already matched
  for (let i = 0; i < WORD_LENGTH; i++) {
    // process unmatched letters
    if (match[i] != MatchStatus.Matched) {
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (match[j] != MatchStatus.Matched && guess[i] === answer[j]) {
          match[i] = MatchStatus.InWord;
        }
      }
    }
  }
  return match;
}

// determine if game is won
export function isDone(match: number[]) {
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (match[i] != MatchStatus.Matched) {
      return false;
    }
  }
  return true;
}
