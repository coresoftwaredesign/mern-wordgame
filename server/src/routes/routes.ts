import express from "express";
import makeWordGameController from "../controllers/wordGameController";
import { ApplicationContainer } from "../ApplicationContainer";

export default function makeWordRouter(appContainer: ApplicationContainer) {
  const WordGameCtrl = makeWordGameController(appContainer);
  const router = express.Router();

  /**
   * @openapi
   * /api/validate/{gamedate}/{guess}:
   *  get:
   *    tags:
   *    - Word Game
   *    description: Validates gamedate and guess. If isValid, compares guess to answer and returns character match status. If not valid, returns error message.
   *    parameters:
   *    - name: gamedate
   *      in: path
   *      description: Game date
   *      required: true
   *      type: string
   *      example: 2024-03-24
   *    - name: guess
   *      in: path
   *      description: Guess
   *      required: true
   *      type: string
   *      example: crate
   *    responses:
   *      "200":
   *        description: Validate guess and return status
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/validationResponse'
   *      "400":
   *        description: Error processing request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/errorResponse'
   */
  router.get("/validate/:gamedate/:guess", WordGameCtrl.validateWord);

  /**
   * @openapi
   * /api/word/{gamedate}:
   *  get:
   *    tags:
   *    - Word Game
   *    description: Get word (answer) for provided game date
   *    parameters:
   *    - name: gamedate
   *      in: path
   *      description: Game date
   *      required: true
   *      type: string
   *      example: 2024-03-24
   *    responses:
   *      "200":
   *        description: Correct answer for game date
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/gameWordResponse'
   *      "400":
   *        description: Error processing request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/errorResponse'
   */
  router.get("/word/:gamedate", WordGameCtrl.getAnswer);

  /**
   * @openapi
   * /api/games:
   *  get:
   *    tags:
   *    - Support API
   *    description: Get all game dates and answers
   *    responses:
   *      "200":
   *        description: Correct answer for game date
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/gameWordResponse'
   *      "400":
   *        description: Error processing request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/errorResponse'
   */
  router.get("/games", WordGameCtrl.getGames);

  /**
   * @openapi
   * /api/words:
   *  get:
   *    tags:
   *    - Support API
   *    description: Get all valid words
   *    responses:
   *      "200":
   *        description: List of all valid words
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/gameWordResponse'
   *      "400":
   *        description: Error processing request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/errorResponse'
   */
  router.get("/words", WordGameCtrl.getWords);

  /**
   * @openapi
   * /api:
   *  get:
   *     tags:
   *     - Support API
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  router.get("/", function (req, res) {
    res.send("app is ok");
  });

  return router;
}
