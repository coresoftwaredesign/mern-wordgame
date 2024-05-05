import "dotenv/config";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import GameDal from "../../../src/db/GameDal";
import { connectDatabase, closeDatabase } from "../../../src/db/index";

describe.skip("MongoDB Integration Tests", () => {
  var gamedal: GameDal;

  beforeAll(() => {
    gamedal = new GameDal();
    connectDatabase();
  });

  describe("getGames", function () {
    it("gets a lot (> 2300) of games", async function () {
      const response = await gamedal.getGames();
      expect(response.length > 2300);
    });
  });

  describe("getWords", function () {
    it("gets a lot (> 12900) of words", async function () {
      const response = await gamedal.getWords();
      expect(response.length > 12900);
    });
  });

  describe("getWord", function () {
    it("gets a words", async function () {
      const response = await gamedal.getWord("label");
      expect(response).toBeDefined();
      if (response != null) {
        expect(response.word).toBe("label");
        expect(response.gamedate).toStrictEqual(
          new Date("2025-03-11T00:00:00.000Z")
        );
      }
    });

    it("can't find non-word", async function () {
      const response = await gamedal.getWord("asdfg");
      expect(response).toBeUndefined;
    });
  });

  describe("getWordByDate", function () {
    it("gets a word by date", async function () {
      const response = await gamedal.getWordByDate(new Date("2024-03-24"));
      expect(response).toBeDefined();
      if (response != null) {
        expect(response.word).toBe("lapel");
      }
    });

    it("can't find word out of date range", async function () {
      const response = await gamedal.getWordByDate(new Date("2020-01-01"));
      expect(response === null);
    });
  });

  afterAll(() => {
    closeDatabase();
  });
});
