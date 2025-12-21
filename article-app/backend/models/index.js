import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import configFile from "../config/config.cjs";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

const files = fs
  .readdirSync(currentDir)
  .filter(
    (file) =>
      file.endsWith(".js") &&
      file !== "index.js"
  );

for (const file of files) {
  const modelPath = path.join(currentDir, file);
  const { default: modelDef } = await import(`file://${modelPath}`);
  const model = modelDef(sequelize, Sequelize.DataTypes);
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
