import { mock } from "ts-jest-mocker";
import { ObjectId } from "mongodb";
import GameDal from "../../../src/db/GameDal";
import { WordGameService } from "../../../src/services/WordGameService";
import { ApplicationContainer } from "../../../src/ApplicationContainer";

function getMockGameWord(word: string) {
  return {
    _id: new ObjectId("65daaa934cbce529d579009a"),
    word: word,
    gamedate: new Date("2024-03-24T00:00:00.000Z"),
  };
}

function getMockGameWordList(word: string) {
  return [
    {
      _id: new ObjectId("65daaa934cbce529d579009a"),
      word: word,
      gamedate: new Date("2024-03-24T00:00:00.000Z"),
    },
  ];
}

function getMockAppContainer(dal: GameDal) {
  const mockAppContainer = mock(ApplicationContainer);
  mockAppContainer.getDataAccessLayer.mockReturnValue(dal);
  return mockAppContainer;
}

describe("WordGameService Tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getAnswer", function () {
    it("responds with answer", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockResolvedValue(getMockGameWord("lapel"));
      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.getAnswer("2024-03-24");
      expect(response).toBeDefined();
      if (response) {
        expect(response.word).toEqual("lapel");
        expect(response.gamedate).toEqual(new Date("2024-03-24"));
      }
    });

    it("responds with no word for date", async function () {
      const dal = mock(GameDal);
      dal.getWord.mockResolvedValue(undefined);
      const service = new WordGameService(getMockAppContainer(dal));
      await expect(service.getAnswer("2024-03-24")).rejects.toThrow(
        WordGameService.NO_WORD_FOR_DATE
      );
    });

    it("response with bad date", async function () {
      const dal = mock(GameDal);
      const service = new WordGameService(getMockAppContainer(dal));
      await expect(service.getAnswer("2024-03-XX")).rejects.toThrow(
        "Invalid game date"
      );
    });

    it("response with exception", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockImplementationOnce(() => {
        throw new Error("mock getWord error");
      });
      const service = new WordGameService(getMockAppContainer(dal));
      await expect(service.getAnswer("2024-03-24")).rejects.toThrow(
        "mock getWord error"
      );
    });
  });

  describe("validateGuess", function () {
    it("responds with match", async function () {
      const dal = mock(GameDal);
      dal.getWord.mockResolvedValue(getMockGameWord("lapel"));
      dal.getWordByDate.mockResolvedValue(getMockGameWord("lapel"));
      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.validateGuess("2024-03-24", "lapel");
      expect(response.isDone).toEqual(true);
      expect(response.isValid).toEqual(true);
      expect(response.match).toEqual([3, 3, 3, 3, 3]);
    });

    it("responds with partial match", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockResolvedValue(getMockGameWord("lapel"));
      dal.getWord.mockResolvedValue(getMockGameWord("label"));
      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.validateGuess("2024-03-24", "label");
      expect(response.isDone).toEqual(false);
      expect(response.isValid).toEqual(true);
      expect(response.match).toEqual([3, 3, 1, 3, 3]);
    });

    it("responds with error due to answer not received", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockResolvedValue(undefined);
      dal.getWord.mockResolvedValue(getMockGameWord("lapel"));
      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.validateGuess("2024-03-24", "lapel");
      expect(response.isValid).toEqual(false);
      expect(response.message).toEqual("Answer not received");
    });

    it("responds not in list", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockResolvedValue(getMockGameWord("lapel"));
      dal.getWord.mockResolvedValue(undefined);
      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.validateGuess("2024-03-24", "xxxxx");
      expect(response.isValid).toEqual(false);
      expect(response.message).toEqual("Not in word list");
    });

    it("responds with not enough letters", async function () {
      const dal = mock(GameDal);
      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.validateGuess("2024-03-24", "x");
      expect(response.isValid).toEqual(false);
      expect(response.message).toEqual("Not enough letters");
    });

    it("responds invalid date", async function () {
      const dal = mock(GameDal);
      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.validateGuess("2024-03-XX", "lapel");
      expect(response.isValid).toEqual(false);
      expect(response.message).toEqual("Invalid game date");
    });

    it("responds with getWord error", async function () {
      const dal = mock(GameDal);
      dal.getWordByDate.mockImplementationOnce(() => {
        throw new Error("mock getWord error");
      });

      const service = new WordGameService(getMockAppContainer(dal));
      await expect(service.getAnswer("2024-03-24")).rejects.toThrow(
        "mock getWord error"
      );
    });
  });

  describe("getGames", function () {
    it("responds with list of games", async function () {
      const dal = mock(GameDal);
      dal.getGames.mockResolvedValue(getMockGameWordList("tests"));

      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.getGames();

      expect(response.games.length).toEqual(1);
      expect(response.games[0].word).toEqual("tests");
    });

    it("responds with error", async function () {
      const dal = mock(GameDal);
      dal.getGames.mockImplementationOnce(() => {
        throw new Error("mock getGames error");
      });

      const service = new WordGameService(getMockAppContainer(dal));
      await expect(service.getGames()).rejects.toThrow("mock getGames error");
    });
  });

  describe("getWords", function () {
    it("responds with list of words", async function () {
      const dal = mock(GameDal);
      dal.getWords.mockResolvedValue(getMockGameWordList("tests"));

      const service = new WordGameService(getMockAppContainer(dal));
      const response = await service.getWords();

      expect(response.words.length).toEqual(1);
      expect(response.words[0].word).toEqual("tests");
    });

    it("responds with error", async function () {
      const dal = mock(GameDal);
      dal.getWords.mockImplementationOnce(() => {
        throw new Error("mock getWords error");
      });

      const service = new WordGameService(getMockAppContainer(dal));
      await expect(service.getWords()).rejects.toThrow("mock getWords error");
    });
  });
});
