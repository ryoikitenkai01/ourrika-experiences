#!/usr/bin/env node
// AgentShield PreToolUse hook — blocks dangerous Bash patterns before execution
"use strict";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // not JSON — let it pass
  }

  const cmd = (input.tool_input || {}).command || "";

  const blocked = [
    { pattern: /rm\s+-rf\s+\//, label: "rm -rf on root path" },
    { pattern: /git\s+push\s+(--force|-f)/, label: "force push" },
    { pattern: /git\s+reset\s+--hard/, label: "hard reset" },
    { pattern: /curl[^|#\n]+\|\s*(ba)?sh/, label: "curl-pipe-shell" },
    { pattern: /wget[^|#\n]+\|\s*(ba)?sh/, label: "wget-pipe-shell" },
    { pattern: />\s*\/dev\/(?!null|std)/, label: "write to device file" },
    { pattern: /DROP\s+TABLE/i, label: "SQL DROP TABLE" },
    { pattern: /ssh\s+.+@/, label: "outbound SSH connection" },
  ];

  const hit = blocked.find((b) => b.pattern.test(cmd));
  if (hit) {
    console.error(`AgentShield: blocked — ${hit.label}`);
    console.error(`Command: ${cmd.slice(0, 120)}`);
    process.exit(2);
  }

  process.exit(0);
});
