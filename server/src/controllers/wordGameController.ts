import { Response, Request } from "express";
import { WordGameService } from "../services/WordGameService";
import { ApplicationContainer } from "../ApplicationContainer";

export default function makeWordGameController(
  appContainer: ApplicationContainer
) {
  const service = new WordGameService(appContainer);

  // process a guess
  async function validateWord(req: Request, res: Response) {
    try {
      const response = await service.validateGuess(
        req.params.gamedate,
        req.params.guess
      );

      return res.status(200).json(response);
    } catch (error: unknown) {
      return res
        .status(400)
        .json({ error: { message: (error as Error).message } });
    }
  }

  // get list of all words
  async function getWords(_req: Request, res: Response) {
    try {
      const words = await service.getWords();
      return res.status(200).json(words);
    } catch (error: unknown) {
      return res
        .status(400)
        .json({ error: { message: (error as Error).message } });
    }
  }

  // get a word (answer) for requested date in format YYYYMMDD
  async function getAnswer(req: Request, res: Response) {
    try {
      const answerResponse = await service.getAnswer(req.params.gamedate);
      return res.status(200).json(answerResponse);
    } catch (error: unknown) {
      return res
        .status(400)
        .json({ error: { message: (error as Error).message } });
    }
  }

  // get list of game dates and words (answers)
  async function getGames(req: Request, res: Response) {
    try {
      const games = await service.getGames();
      return res.status(200).json(games);
    } catch (error: unknown) {
      return res
        .status(400)
        .json({ error: { message: (error as Error).message } });
    }
  }

  return {
    validateWord,
    getAnswer,
    getWords,
    getGames,
  };
}
