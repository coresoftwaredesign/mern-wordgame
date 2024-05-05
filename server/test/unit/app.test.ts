import request from "supertest";
import { mock } from "ts-jest-mocker";

import GameDal from "../../src/db/GameDal";
import makeApp from "../../src/app";
import { ObjectId } from "mongodb";
import { ApplicationContainer } from "../../src/ApplicationContainer";

function getMockGameWord(word: string) {
  return {
    _id: new ObjectId("65daaa934cbce529d579009a"),
    word: word,
    gamedate: new Date("2024-03-24T00:00:00.000Z"),
  };
}

function getMockAppContainer(dal: GameDal) {
  const mockAppContainer = mock(ApplicationContainer);
  mockAppContainer.getDataAccessLayer.mockReturnValue(dal);
  return mockAppContainer;
}

describe("API Service Tests", () => {
  describe("static test endpoint", function () {
    it("calls static test endpoint and gets correct response", async function () {
      const dal = new GameDal();
      const app = makeApp(getMockAppContainer(dal));
      const response = await request(app).get("/api/");
      expect(response.status).toEqual(200);
      expect(response.text).toEqual("app is ok");
    });
  });

  describe("GET /api/word", function () {
    it("responds with result", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockResolvedValue(getMockGameWord("lapel"));
      const app = makeApp(getMockAppContainer(dal));

      const response = await request(app)
        .get("/api/word/2024-03-24/")
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
    });

    it("response with exception", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockImplementation(() => {
        throw new Error("mock getWord error");
      });
      const app = makeApp(getMockAppContainer(dal));
      const response = await request(app)
        .get("/api/word/2024-03-24/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
    });
  });

  describe("GET /api/validate/", function () {
    it("responds with result", async function () {
      const dal = mock(GameDal);
      dal.getWord.mockResolvedValue(getMockGameWord("lapel"));
      dal.getWordByDate.mockResolvedValue(getMockGameWord("lapel"));
      const app = makeApp(getMockAppContainer(dal));
      const response = await request(app)
        .get("/api/validate/2024-03-24/lapel")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });

    it("responds with error", async function () {
      const dal = mock(GameDal);

      dal.getWord.mockImplementation(() => {
        throw new Error("mock getWord error");
      });
      dal.getWordByDate.mockImplementation(() => {
        throw new Error("mock getWordByDate error");
      });

      const app = makeApp(getMockAppContainer(dal));

      const response = await request(app)
        .get("/api/validate/2024-03-24/label")
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
    });
  });

  describe("GET /api/games/", function () {
    it("responds with json", async function () {
      const dal = mock(GameDal);
      const app = makeApp(getMockAppContainer(dal));
      const response = await request(app)
        .get("/api/games/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });

    it("responds with error", async function () {
      const dal = mock(GameDal);
      dal.getGames.mockImplementation(() => {
        throw new Error("mock getGames error");
      });
      const app = makeApp(getMockAppContainer(dal));
      const response = await request(app)
        .get("/api/games/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
    });
  });

  describe("GET /api/words/", function () {
    it("responds with json", async function () {
      const dal = mock(GameDal);
      const app = makeApp(getMockAppContainer(dal));
      const response = await request(app)
        .get("/api/words/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });

    it("responds with error", async function () {
      const dal = mock(GameDal);
      dal.getWords.mockImplementation(() => {
        throw new Error("mock getWords error");
      });
      const app = makeApp(getMockAppContainer(dal));
      const response = await request(app)
        .get("/api/words/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
    });
  });

  describe("API Errors", function () {
    const app = makeApp(mock(ApplicationContainer));
    it("responds with a 404 error", async function () {
      const response = await request(app)
        .get("/api/foobar/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(404);
    });
  });
});
