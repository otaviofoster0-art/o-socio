// Monta o documento HTML completo a partir de o-socio.html
// (o arquivo é escrito sem <head> para também poder ser publicado no Claude).
const ICONE = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#0F172A"/><g transform="translate(6 6) scale(.75)"><path fill="#D4AF7C" d="M38 11.5C33.6 6.4 25.8 4.6 18.9 7.2 11.4 10 7.6 17.6 10.5 23.3c2.1 4.1 7.4 5.6 13.5 4.4-5.1-.4-8.3-2.7-8.6-6.3-.4-4.9 4.6-9.7 11.4-10.8 4.2-.7 8.3.1 11.2.9z"/><path fill="#D4AF7C" d="M10 36.5c4.4 5.1 12.2 6.9 19.1 4.3 7.5-2.8 11.3-10.4 8.4-16.1-2.1-4.1-7.4-5.6-13.5-4.4 5.1.4 8.3 2.7 8.6 6.3.4 4.9-4.6 9.7-11.4 10.8-4.2.7-8.3-.1-11.2-.9z"/></g></svg>`
);

const DESCRICAO = "O Sócio: um sócio virtual com IA que conecta todos os dados da empresa, recomenda decisões e conversa com o empresário. Protótipo com dados fictícios de uma clínica odontológica.";

export function montarPagina(conteudo) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${DESCRICAO}">
<meta name="theme-color" content="#0F172A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="O Sócio">
<meta property="og:title" content="O Sócio · Seu sócio virtual">
<meta property="og:description" content="${DESCRICAO}">
<meta property="og:type" content="website">
<link rel="icon" href="${ICONE}">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${conteudo}
</body>
</html>
`;
}
