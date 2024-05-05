import {
  WORD_LENGTH,
  MatchStatus,
  scoreGuess,
  isDone,
  validateGuess,
  validateGameDate,
} from "../services/gameLogic";
import { ValidationResponse } from "./api/ValidationResponse";
import { AnswerResponse } from "./api/AnswerResponse";
import { GamesResponse } from "./api/GamesResponse";
import { WordsResponse } from "./api/WordsResponse";
import { ApplicationContainer } from "../ApplicationContainer";
import GameDal from "../db/GameDal";

export class WordGameService {
  private dal: GameDal;
  static readonly NOT_IN_LIST = "Not in word list";
  static readonly ANSWER_NOT_RECEIVED = "Answer not received";
  static readonly NO_WORD_FOR_DATE = "No word for date";

  constructor(appContainer: ApplicationContainer) {
    this.dal = appContainer.getDataAccessLayer();
  }

  validationFail(message: string): ValidationResponse {
    return {
      isValid: false,
      message: message,
      isDone: false,
      match: Array(WORD_LENGTH).fill(MatchStatus.Invalid),
    };
  }

  async validateGuess(
    gamedateAsString: string,
    guess: string
  ): Promise<ValidationResponse> {
    try {
      let validationMessage = validateGuess(guess);
      if (validationMessage !== "") {
        return this.validationFail(validationMessage);
      }

      validationMessage = validateGameDate(gamedateAsString);
      if (validationMessage !== "") {
        return this.validationFail(validationMessage);
      }

      guess = guess.toLowerCase();
      const gamedate = new Date(gamedateAsString);

      // search for guess in list of approved words
      const guessResult = await this.dal.getWord(guess);
      if (!guessResult) {
        return this.validationFail(WordGameService.NOT_IN_LIST);
      }

      // look up answer for gamedate
      const answer = await this.dal.getWordByDate(gamedate);

      if (answer != undefined) {
        // compare answer to guess
        const match = scoreGuess(guess, answer.word);
        return {
          isValid: true,
          match: match,
          isDone: isDone(match),
        };
      } else {
        return this.validationFail(WordGameService.ANSWER_NOT_RECEIVED);
      }
    } catch (error) {
      throw error;
    }
  }

  async getAnswer(dateAsString: string): Promise<AnswerResponse> {
    try {
      const validationMessage = validateGameDate(dateAsString);
      if (validationMessage !== "") {
        throw new Error(validationMessage);
      }

      const gamedate = new Date(dateAsString);
      const answer = await this.dal.getWordByDate(gamedate);

      if (answer) {
        return { word: answer.word, gamedate: gamedate };
      } else {
        throw new Error(WordGameService.NO_WORD_FOR_DATE);
      }
    } catch (error) {
      throw error;
    }
  }

  async getGames(): Promise<GamesResponse> {
    try {
      const games = await this.dal.getGames();
      return { games };
    } catch (error) {
      throw error;
    }
  }

  async getWords(): Promise<WordsResponse> {
    try {
      const words = await this.dal.getWords();
      return { words };
    } catch (error) {
      throw error;
    }
  }
}
