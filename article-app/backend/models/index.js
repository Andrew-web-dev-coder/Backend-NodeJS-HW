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


const files = fs.readdirSync(__dirname).filter(
  (file) =>
    file.endsWith(".js") &&
    file !== "index.js"
);


for (const file of files) {
  const modelPath = path.join(__dirname, file);
  const { default: modelDef } = await import(`file://${modelPath}`);
  const model = modelDef(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}


Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
