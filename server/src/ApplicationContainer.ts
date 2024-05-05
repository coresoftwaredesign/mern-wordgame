import GameDal from "./db/GameDal";

export class ApplicationContainer {
  private dal: GameDal;

  constructor() {
    this.dal = new GameDal();
  }

  getDataAccessLayer(): GameDal {
    return this.dal;
  }
}
