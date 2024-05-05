import Word from "../models/gameWordModel";

// all MongoDB-specific code is here
export default class GameDal {
  async getWord(word: string) {
    const results = await Word.findOne({ word: word });
    return results?.toObject();
  }

  async getWordByDate(gamedate: Date) {
    const results = await Word.findOne({ gamedate: gamedate });
    return results?.toObject();
  }

  async getGames() {
    const results = await Word.find({ gamedate: { $exists: true } }).sort({
      gamedate: 1,
    });
    return results.map((model) => model.toObject());
  }

  async getWords() {
    const results = await Word.find({});
    return results.map((model) => model.toObject());
  }
}
