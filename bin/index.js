#!/usr/bin/env node

import fs from "fs";
import path from "path";
import url from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const projectName = process.argv[2] || "my-express-app";
const targetDir = path.join(process.cwd(), projectName);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Project already exists at ${targetDir}`);
  process.exit(1);
}

fs.cpSync(path.join(__dirname, "../template"), targetDir, { recursive: true });

const pkgPath = path.join(targetDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = projectName;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`✅ Project "${projectName}" created successfully! 🎉`);
console.log("📦 Installing dependencies...");

execSync("npm install express@latest dotenv@latest", {
  stdio: "inherit",
  cwd: targetDir,
});
execSync(
  "npm install @types/express@latest @types/node@latest nodemon@latest ts-node@latest typescript@latest -D",
  { stdio: "inherit", cwd: targetDir }
);

console.log("✨ Done!");
console.log(`
Next steps:
  cd ${projectName}
  npm run dev
Happy coding! 🚀
`);
