import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import configFile from "../config/config.cjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);


const db = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.endsWith(".js") &&
      file !== "index.js"
  );

for (const file of modelFiles) {
  const fullPath = path.join(__dirname, file);
  const imported = await import(`file://${fullPath}`);


  const modelFactory =
    imported.default || imported;

  if (typeof modelFactory !== "function") {
    throw new Error(`Model ${file} does not export a factory function`);
  }

  const model = modelFactory(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}


Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
