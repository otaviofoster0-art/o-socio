// Monta o documento HTML completo a partir de o-socio.html
// (o arquivo é escrito sem <head> para também poder ser publicado no Claude).
const ICONE = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A1A7A"/><stop offset="1" stop-color="#0B0A24"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6DDAF"/><stop offset=".5" stop-color="#D4AF7C"/><stop offset="1" stop-color="#9C7440"/></linearGradient><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9A2FF"/><stop offset=".5" stop-color="#6C38FF"/><stop offset="1" stop-color="#2A118F"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#f)"/><g transform="translate(6 6) scale(.75)"><path fill="url(#p)" d="M37 14.6c-4.6-3.9-11.1-4.6-16.4-2.1-5.8 2.8-8.3 8.9-5.5 13.2 1.8 2.8 5.8 3.8 9.6 3.1-3.4-.7-5.6-2.6-5.7-5.3-.2-4.3 4.2-7.9 9.7-8.6 3-.4 6 0 8.3-.3z"/><path fill="url(#p)" d="M11 33.4c4.6 3.9 11.1 4.6 16.4 2.1 5.8-2.8 8.3-8.9 5.5-13.2-1.8-2.8-5.8-3.8-9.6-3.1 3.4.7 5.6 2.6 5.7 5.3.2 4.3-4.2 7.9-9.7 8.6-3 .4-6 0-8.3.3z"/><path fill="url(#g)" d="M38 11.5C33.6 6.4 25.8 4.6 18.9 7.2 11.4 10 7.6 17.6 10.5 23.3c2.1 4.1 7.4 5.6 13.5 4.4-5.1-.4-8.3-2.7-8.6-6.3-.4-4.9 4.6-9.7 11.4-10.8 4.2-.7 8.3.1 11.2.9z"/><path fill="url(#g)" d="M10 36.5c4.4 5.1 12.2 6.9 19.1 4.3 7.5-2.8 11.3-10.4 8.4-16.1-2.1-4.1-7.4-5.6-13.5-4.4 5.1.4 8.3 2.7 8.6 6.3.4 4.9-4.6 9.7-11.4 10.8-4.2.7-8.3-.1-11.2-.9z"/></g></svg>`
);

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
<link rel="icon" href="${ICONE}">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${conteudo}
</body>
</html>
`;
}
