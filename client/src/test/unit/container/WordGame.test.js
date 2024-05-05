import WordGame from "../../../container/WordGame";

describe("isAnimated", () => {
    it("should return isAnimated true", () => {
        const isAnimated = WordGame.isAnimated(WordGame.MatchStatus.Matched);
        expect(isAnimated).toBe(true);
    });

    it("should return isAnimated false", () => {
        const isAnimated = WordGame.isAnimated(WordGame.MatchStatus.Unknown);
        expect(isAnimated).toBe(false);
    });
});
