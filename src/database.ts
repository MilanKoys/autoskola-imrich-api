import { Db, MongoClient } from "mongodb";
import { Undefined } from "./contracts/undefined.js";

let database: Undefined<Db>;

interface DatabaseParams {
  uri: string;
  databaseName: string;
}

export async function getDatabase(params?: DatabaseParams): Promise<Db> {
  if (database) {
    return new Promise((resolve) => {
      if (database) resolve(database);
    });
  } else {
    if (!params) throw new Error("No database connection parameters");
    try {
      const client = new MongoClient(params.uri);
      await client.connect();

      const databaseInstance: Db = client.db(params.databaseName);
      database = databaseInstance;
      return databaseInstance;
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }
}
