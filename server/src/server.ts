import "dotenv/config";
import debugLib from "debug";
import * as http from "http";

import makeApp from "./app";
import { connectDatabase } from "./db/index";
import { ApplicationContainer } from "./ApplicationContainer";
import swaggerDocs from "./utils/swagger";

const debug = debugLib("myapp:server");

// create app, inject real DB DAL via dependency injection
connectDatabase();
const appContainer = new ApplicationContainer();
const app = makeApp(appContainer);

const port = process.env.PORT || "5000";
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
server.on("listening", onListening);

function onListening() {
  debug("Listening on " + server.address());
  swaggerDocs(app);
}
