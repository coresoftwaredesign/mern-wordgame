// core business logic for Word Guess game
export default class WordGame {
    static WORD_LENGTH = 5;
    static NUM_GUESSES = 6;

    static MatchStatus = {
        Invalid: -1,
        Unknown: 0,
        UnMatched: 1,
        InWord: 2,
        Matched: 3,
    };

    static gameOverResponse = [
        "Genius",
        "Magnificent",
        "Impressive",
        "Splendid",
        "Great",
        "Phew",
    ];

    static matchClassMap = new Map([
        [this.MatchStatus.Invalid, "shake"],
        [this.MatchStatus.Unknown, "unknown"],
        [this.MatchStatus.UnMatched, "not-matched"],
        [this.MatchStatus.InWord, "in-word"],
        [this.MatchStatus.Matched, "matched"],
    ]);

    static isAnimated(matchStatus) {
        return (
            matchStatus === WordGame.MatchStatus.UnMatched ||
            matchStatus === WordGame.MatchStatus.InWord ||
            matchStatus === WordGame.MatchStatus.Matched
        );
    }

}