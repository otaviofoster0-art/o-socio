// Gera a prévia pública em docs/index.html (publicada pelo GitHub Pages).
// Rode depois de editar o-socio.html:  node gerar-site.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { montarPagina } from "./pagina.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const conteudo = await readFile(path.join(here, "o-socio.html"), "utf8");
await mkdir(path.join(here, "docs"), { recursive: true });
await writeFile(path.join(here, "docs", "index.html"), montarPagina(conteudo));
await writeFile(path.join(here, "docs", ".nojekyll"), "");
console.log("Prévia gerada em docs/index.html");
