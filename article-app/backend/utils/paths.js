import { fileURLToPath } from "url";
import path from "path";

export function getDirname(metaUrl) {
  return path.dirname(fileURLToPath(metaUrl));
}
