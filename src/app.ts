import { getDatabase } from "./database.js";
import api from "./api.js";

const databaseUri: string = "mongodb://127.0.0.1:27017/?directConnection=true";
const databaseName: string = "repa";
const apiPort: number = 8000;

await getDatabase({
  uri: databaseUri,
  databaseName: databaseName,
});

api.listen(apiPort, () =>
  console.log(`Back-end running on http://localhost:${apiPort}`),
);
