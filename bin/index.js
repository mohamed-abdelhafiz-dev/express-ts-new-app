#!/usr/bin/env node

import fs from "fs";
import path from "path";
import url from "url";

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

console.log(`✅ Project created at ${targetDir}! 🎉🎉`);

console.log(`
Next steps:
  cd ${projectName}
  npm install   # or yarn / pnpm install
  npm run dev
`);
