import "dotenv/config";
import { connectDatabase, closeDatabase } from "../../../src/db/index";

let originalError = console.error;

describe.skip("Database Integration Tests", () => {
  describe("Missing ENV vars", function () {
    beforeAll(() => {
      delete process.env.MONGO_URI;
      console.error = jest.fn();
      jest.resetModules();
    });

    it("fails wihtout MONGO_URI set", async function () {
      const db = connectDatabase();
      expect(db.readyState).toBe(0);
    });
  });

  afterAll(() => {
    console.error = originalError;
    closeDatabase();
  });
});
