import WordGame from "./WordGame";

export default class Guess {
    isValid = false;
    message = "";
    guessText = "";
    isDone = false;
    matchStatus = Array(WordGame.WORD_LENGTH).fill(WordGame.MatchStatus.Unknown);

    constructor(guessText) {
        this.guessText = guessText;
    }
}
