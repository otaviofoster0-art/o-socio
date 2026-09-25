// Monta o documento HTML completo a partir de o-socio.html
// (o arquivo é escrito sem <head> para também poder ser publicado no Claude).
import { readFileSync } from "node:fs";

// Símbolo oficial da marca (assets/), embutido para a página funcionar sozinha.
const png = (nome) => "data:image/png;base64," + readFileSync(new URL("./assets/" + nome, import.meta.url)).toString("base64");
const ICONE = png("simbolo-64.png");
const ICONE_APPLE = png("simbolo-192.png");

const DESCRICAO = "O Sócio, seu aliado virtual: uma IA que conecta todos os dados da empresa, recomenda decisões e conversa com o empresário. Protótipo com dados fictícios de uma clínica odontológica.";

export function montarPagina(conteudo) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${DESCRICAO}">
<meta name="theme-color" content="#0F0E2E">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="O Sócio">
<meta property="og:title" content="O Sócio · Seu aliado virtual">
<meta property="og:description" content="${DESCRICAO}">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" href="${ICONE}">
<link rel="apple-touch-icon" href="${ICONE_APPLE}">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${conteudo}
</body>
</html>
`;
}
