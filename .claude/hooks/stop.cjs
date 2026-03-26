#!/usr/bin/env node
// AgentShield Stop hook — session-end verification
"use strict";

const { execSync } = require("child_process");

let warnings = [];

// Check for uncommitted secret-like files
try {
  const status = execSync("git status --short 2>/dev/null", {
    encoding: "utf8",
    cwd: process.cwd(),
  });
  const secretPatterns = [/\.env$/, /secrets?\./, /credentials?\./, /private.*key/i];
  status.split("\n").forEach((line) => {
    const file = line.slice(3).trim();
    if (secretPatterns.some((p) => p.test(file))) {
      warnings.push(`Uncommitted sensitive file: ${file}`);
    }
  });
} catch {
  // git not available or not a repo — skip
}

if (warnings.length > 0) {
  console.error("AgentShield Stop: session-end warnings:");
  warnings.forEach((w) => console.error(`  ⚠ ${w}`));
}

process.exit(0);
