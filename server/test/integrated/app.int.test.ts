import "dotenv/config";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";

import { connectDatabase, closeDatabase } from "../../src/db/index";
import makeApp from "../../src/app";
import { ApplicationContainer } from "../../src/ApplicationContainer";

describe.skip("API Service Integration Tests", () => {
  let app: any;

  beforeAll(() => {
    connectDatabase();
    const appContainer = new ApplicationContainer();
    app = makeApp(appContainer);
  });

  describe("API static test endpoint", function () {
    it("calls API endpoint and gets correct response", async function () {
      const response = await request(app).get("/api/");
      expect(response.status).toEqual(200);
      expect(response.text).toEqual("app is ok");
    });
  });

  describe("GET /api/word/", function () {
    it("responds with json answer", async function () {
      const response = await request(app)
        .get("/api/word/2024-03-24/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });

    it("response with bad date", async function () {
      const response = await request(app)
        .get("/api/word/2024-03-2x/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
    });
  });

  describe("GET /api/validate/", function () {
    it("responds with match", async function () {
      const response = await request(app)
        .get("/api/validate/2024-03-24/lapel")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });

    it("responds with no match", async function () {
      const response = await request(app)
        .get("/api/validate/2024-03-24/label")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });

    it("responds with not enough letters", async function () {
      const response = await request(app)
        .get("/api/validate/2024-03-24/labe")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });

    it("responds with not in list", async function () {
      const response = await request(app)
        .get("/api/validate/2024-03-24/zzzzz")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });
  });

  describe("GET /api/games/", function () {
    it("responds with json", async function () {
      const response = await request(app)
        .get("/api/games/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });
  });

  describe("GET /api/words/", function () {
    it("responds with json", async function () {
      const response = await request(app)
        .get("/api/words/")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
    });
  });

  afterAll(() => {
    closeDatabase();
  });
});
