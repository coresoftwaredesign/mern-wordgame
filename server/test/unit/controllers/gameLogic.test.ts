import {
  scoreGuess,
  isDone,
  validateGuess,
  validateGameDate,
} from "../../../src/services/gameLogic";
import { describe, expect, it } from "@jest/globals";

describe("game-logic", function () {
  // scoreGuess
  describe("scoreGuess", function () {
    it("guess matches answer", () => {
      expect(scoreGuess("forth", "forth")).toStrictEqual([3, 3, 3, 3, 3]);
    });

    it("guess no letters match answer", () => {
      expect(scoreGuess("zzzzz", "forth")).toStrictEqual([1, 1, 1, 1, 1]);
    });

    it("guess partial match answer", () => {
      expect(scoreGuess("foots", "forth")).toStrictEqual([3, 3, 1, 3, 1]);
    });

    it("guess no matches but has letters in answer", () => {
      expect(scoreGuess("deabc", "abcde")).toStrictEqual([2, 2, 2, 2, 2]);
    });

    it("guess double letter - single letter answer", () => {
      expect(scoreGuess("lotto", "loppy")).toStrictEqual([3, 3, 1, 1, 1]);
    });

    it("guess double letter - double letter answer", () => {
      expect(scoreGuess("lotto", "loopy")).toStrictEqual([3, 3, 1, 1, 2]);
    });
  });

  // isDone
  describe("isDone", function () {
    it("match is done", () => {
      expect(isDone([3, 3, 3, 3, 3])).toBe(true);
    });

    it("match is not done", () => {
      expect(isDone([3, 3, 3, 3, 2])).toBe(false);
      expect(isDone([1, 1, 1, 1, 1])).toBe(false);
    });
  });

  // validateGuessParameters
  describe("validateGuess", function () {
    it("responds with guess parameter is good", () => {
      expect(validateGuess("abcde")).toBe("");
    });

    it("responds with game guess parameter is too short", () => {
      expect(validateGuess("abcd")).toBe("Not enough letters");
    });

    it("responds with game guess parameter is invalid", () => {
      expect(validateGuess("1. 34")).toBe("Not enough letters");
    });
  });

  describe("validateGameDate", function () {
    it("responds with game date parameter is good", () => {
      expect(validateGameDate("2024-01-01")).toBe("");
    });

    it("responds with game date parameter is good", () => {
      expect(validateGameDate("2024-03-10")).toBe("");
    });

    it("responds with game date month parameter is Invalid", () => {
      expect(validateGameDate("2024-13-10")).toBe("Invalid game date");
    });

    it("responses with game date day parameter is Invalid", () => {
      expect(validateGameDate("2024-10-32")).toBe("Invalid game date");
    });

    it("responds with game date parameter is Invalid", () => {
      expect(validateGameDate("2034-10-15")).toBe("Invalid game date");
    });

    it("responds with game date parameter is Invalid", () => {
      expect(validateGameDate("2024-01-XX")).toBe("Invalid game date");
    });
  });
});
