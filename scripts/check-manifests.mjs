#!/usr/bin/env node

/**
 * Guards against publishing a manifest that no consumer can install.
 *
 * pnpm rewrites `workspace:` ranges into real versions when it packs, so a
 * `workspace:*` dependency is invisible until something *other* than pnpm does
 * the publishing - at which point the literal string ships to the registry and
 * every `npm install` of the package fails with EUNSUPPORTEDPROTOCOL.
 *
 * That is exactly how @cloudinary-util/url-loader@6.3.0 shipped broken: the
 * release pipeline moved from `pnpm publish` to `npm publish` to pick up npm's
 * Trusted Publishers, and npm passed the `workspace:*` strings straight through.
 * publint and attw both reported the resulting tarball as clean, so this check
 * exists to cover the gap they leave.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const packagesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "packages");

// Protocols that pnpm understands locally but that are meaningless to a consumer
// installing from the registry.
const LOCAL_ONLY_PROTOCOLS = ["workspace:", "link:", "file:", "portal:"];

const DEPENDENCY_FIELDS = [
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
];

const problems = [];

const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const name of packageDirs) {
  const manifestPath = join(packagesDir, name, "package.json");

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    continue; // not a package
  }

  if (manifest.private) continue;

  for (const field of DEPENDENCY_FIELDS) {
    for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
      if (typeof range !== "string") continue;

      const protocol = LOCAL_ONLY_PROTOCOLS.find((p) => range.startsWith(p));
      if (protocol) {
        problems.push(
          `${manifest.name}: ${field}["${dep}"] is "${range}" - the "${protocol}" ` +
            `protocol does not survive publishing. Use a real semver range.`,
        );
      }
    }
  }
}

if (problems.length > 0) {
  console.error("\nUnpublishable dependency ranges found:\n");
  for (const problem of problems) console.error(`  x ${problem}`);
  console.error(
    "\nCross-package deps in this repo use plain semver ranges; pnpm still links\n" +
      "them locally via link-workspace-packages in .npmrc.\n",
  );
  process.exit(1);
}

console.log(
  `All good! Checked ${packageDirs.length} packages for unpublishable dependency ranges.`,
);
