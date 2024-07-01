import { shell } from "@arktype/fs";
import { printNode, zodToTs } from "zod-to-ts";
import { constructUrlPropsSchema } from "./src/schema.js";

shell("pnpm tsup src/index.ts src/schema.ts --format esm,cjs --dts --clean");

const tsTypeSrc = printNode(
  zodToTs(constructUrlPropsSchema, "constructUrlPropsSchema").node
);

console.log(tsTypeSrc);
