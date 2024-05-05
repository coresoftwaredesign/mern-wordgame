import errorHandler from "errorhandler";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import { ApplicationContainer } from "./ApplicationContainer";
import makeWordRouter from "./routes/routes";

export default function makeApp(appContainer: ApplicationContainer) {
  const app = express();

  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  // app.use(express.static("public"));
  app.use(cors());

  // routes
  const words = makeWordRouter(appContainer);
  app.use("/api", words);

  // Error Handler. Provides full stack
  /* istanbul ignore next  */
  if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
  }

  return app;
}
