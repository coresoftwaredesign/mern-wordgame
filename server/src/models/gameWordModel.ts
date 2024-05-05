import { Schema, model } from "mongoose";
import GameWord from "../services/GameWord";

const Word = new Schema<GameWord>({
  word: { type: String, required: true },
  gamedate: { type: Date, required: false },
});

export default model<GameWord>("word", Word);
