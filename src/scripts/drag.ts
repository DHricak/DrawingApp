import { tool as tot } from "@store";
let tool: tools;
tot.subscribe((r) => tool = r);