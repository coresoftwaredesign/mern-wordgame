import { render, screen, cleanup } from "@testing-library/react";
import GuessLine from "../../../container/GuessLine";
import Guess from "../../../container/Guess";

afterEach(() => {
    cleanup();
});

describe("GuessLine", () => {

    test("should render unknown GuessLine tile array component", () => {
        const guess = new Guess("tests");
        render(<GuessLine guess={guess} isCurrentGuess={true} />);
        const tileElement = screen.getByText("E")
        expect(tileElement).toBeInTheDocument();
        expect(tileElement).toContainHTML("<div class='tile flip-unknown'>E</div>");
    });

    test("should render matched GuessLine tile array component", () => {
        const guess = new Guess("tests");
        guess.matchStatus = [3, 3, 3, 3, 3];
        render(<GuessLine guess={guess} isCurrentGuess={true} />);
        const tileElement = screen.getByText("E")
        expect(tileElement).toBeInTheDocument();
        expect(tileElement).toContainHTML("<div class='tile flip-matched' style='animation-delay: 0.2s;'>E</div>");
    });

    test("should render GuessLine with dance", () => {
        const guess = new Guess("tests");
        guess.matchStatus = [3, 3, 3, 3, 3];
        guess.isDone = true;
        render(<GuessLine guess={guess} isCurrentGuess={true} />);
        const tileElement = screen.getByText("E")
        expect(tileElement).toBeInTheDocument();
        expect(tileElement).toContainHTML("<div class='tile dance' style='animation-delay: 0.2s, 1.1s;'>E</div>");
    });

    test("should render matched not current GuessLine tile array component", () => {
        const guess = new Guess("tests");
        guess.matchStatus = [3, 3, 3, 3, 3];
        render(<GuessLine guess={guess} isCurrentGuess={false} />);
        const tileElement = screen.getByText("E")
        expect(tileElement).toBeInTheDocument();
        expect(tileElement).toContainHTML("<div class='tile matched'>E</div>");
    });

    test("should render in-word GuessLine tile array component", () => {
        const guess = new Guess("tests");
        guess.matchStatus = [2, 2, 2, 2, 2];
        render(<GuessLine guess={guess} isCurrentGuess={true} />);
        const tileElement = screen.getByText("E")
        expect(tileElement).toBeInTheDocument();
        expect(tileElement).toContainHTML("<div class='tile flip-in-word' style='animation-delay: 0.2s;'>E</div>");
    });

    test("should render not-matched GuessLine tile array component", () => {
        const guess = new Guess("tests");
        guess.matchStatus = [1, 1, 1, 1, 1];
        render(<GuessLine guess={guess} isCurrentGuess={true} />);
        const tileElement = screen.getByText("E")
        expect(tileElement).toBeInTheDocument();
        expect(tileElement).toContainHTML("<div class='tile flip-not-matched' style='animation-delay: 0.2s;'>E</div>");
    });

});
