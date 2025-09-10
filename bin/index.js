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

// install runtime dependencies
execSync("npm install express@latest dotenv@latest", {
  stdio: "inherit",
  cwd: targetDir,
});

// install dev dependencies
execSync(
  "npm install -D @types/express@latest @types/node@latest nodemon@latest ts-node@latest typescript@latest eslint@latest @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest typescript-eslint@latest eslint-plugin-import@latest eslint-config-prettier@latest prettier@latest eslint-plugin-prettier@latest",
  { stdio: "inherit", cwd: targetDir }
);

// create .gitignore
const gitignoreContent = `
# Node.js
node_modules
dist
.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode
.idea
`;

fs.writeFileSync(
  path.join(targetDir, ".gitignore"),
  gitignoreContent.trimStart()
);

const dotenvContent = `
# Environment variables

`;

fs.writeFileSync(path.join(targetDir, ".env"), dotenvContent.trimStart());

console.log("initializing git repository...");
execSync("git init", { stdio: "inherit", cwd: targetDir });
execSync("git add .", { stdio: "inherit", cwd: targetDir });
execSync('git commit -m "Initial commit"', {
  stdio: "inherit",
  cwd: targetDir,
});

console.log("✨ Done!");
console.log(`
Next steps:
  cd ${projectName}
  npm run dev
Happy coding! 🚀
`);
