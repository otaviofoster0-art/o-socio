# O Sócio · seu sócio virtual

Protótipo de uma IA de gestão que funciona como sócio virtual e braço direito do empresário. Ela conecta os dados de todas as áreas da empresa (financeiro, comercial, marketing, operações, pessoas, cultura, fiscal e estratégia), recomenda decisões com base nos números e facilita a comunicação com os líderes, enquanto o dono cuida do reforço e da condução humana da equipe.

**Prévia no celular:** o link do GitHub Pages está na descrição deste repositório.

> Todos os dados são fictícios. A empresa de demonstração é a **Clínica Sorrir+**, uma clínica odontológica com 14 colaboradores.

## O que o protótipo mostra

| Área | O que faz |
|---|---|
| Painel | Indicadores personalizáveis, insights do sócio, lembrete do próximo compromisso |
| Converse com o sócio | Chat com a IA sobre os números, com respostas em voz |
| Reunião por voz | Ligação com o sócio para tomar decisões; ao encerrar, gera a ata |
| Agenda + WhatsApp | Compromissos marcados pela agenda ou por mensagem de WhatsApp |
| E-mail | Resumo da caixa de entrada e e-mails escritos com os dados da empresa |
| Reuniões | Resumos com decisões, responsáveis e prazos, vinculados à agenda |
| Relatórios | Pacientes inativos, orçamentos sem resposta, inadimplência e outros, em PDF |
| Documentos | Estratégia de vendas, POP e cargos e funções montados conversando com a IA |
| Integrações | WhatsApp, e-mail, agenda e o sistema operacional da empresa |

## Três jeitos de ver

1. **Prévia pública (GitHub Pages):** abre em qualquer celular. As respostas da IA são de demonstração.
2. **No Claude:** a IA responde ao vivo pela conta de quem abre (link privado do time).
3. **Versão local, completa:** IA ao vivo, microfone e reunião por voz.

### Rodar a versão local

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo e de uma chave da API da Anthropic.

1. Copie `.env.exemplo` para `.env` e cole a sua chave.
2. No Windows, dê dois cliques em `iniciar.bat`. Em outro sistema, rode `npm install` e depois `npm start`.
3. Abra no Chrome ou no Edge e permita o microfone.

A chave fica só no arquivo `.env`, que está no `.gitignore` e nunca vai para o GitHub.

## Como o projeto está organizado

| Arquivo | Para que serve |
|---|---|
| `o-socio.html` | O app inteiro: telas, estilos, dados fictícios e lógica |
| `server.mjs` | Servidor local que guarda a chave e conversa com a API da Anthropic |
| `pagina.mjs` | Monta o HTML completo (usado pelo servidor e pela prévia) |
| `gerar-site.mjs` | Gera a prévia pública em `docs/index.html` |
| `docs/` | Site publicado pelo GitHub Pages |

Depois de editar `o-socio.html`, rode `node gerar-site.mjs` para atualizar a prévia.
