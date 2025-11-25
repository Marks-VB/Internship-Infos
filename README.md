🇺🇸 Guia de Estados para Intercâmbio (Projeto de Extensão)

Bem-vindo ao repositório oficial do Guia de Estados para Intercâmbio, um projeto de extensão interativo desenvolvido para ajudar futuros intercambistas a escolherem o destino ideal nos Estados Unidos.

🎯 Objetivo do Projeto

O objetivo principal deste projeto é fornecer uma ferramenta visual, moderna e intuitiva onde estudantes possam:

Explorar as características de cada estado americano (clima, custo de vida, cultura, etc.).

Comparar diferentes estados lado a lado para tomar decisões informadas.

Receber Recomendações personalizadas através de um Consultor de IA integrado.

Personalizar a visualização dos dados de acordo com o que é mais importante para eles.

✨ Funcionalidades Principais

Grid de Estados Interativo: Visualização em cards modernos com informações essenciais.

Filtros Avançados: Filtre estados por Custo, Clima, Vibe Social e Sotaque.

Comparador Lado a Lado: Selecione até 4 estados para ver uma tabela comparativa detalhada.

🤖 Conselheiro IA (Gemini): Um assistente inteligente que sugere os melhores estados com base no seu perfil (ex: "Gosto de frio e quero economizar").

Análise Comparativa com IA: A IA analisa os estados que você selecionou e dá um veredito sobre qual é o melhor para o seu objetivo.

Personalização de Visualização: Escolha quais dados aparecem nos cards (ex: mostrar apenas Clima e Salário).

Modo Escuro/Claro: Interface adaptável para maior conforto visual.

Responsividade Mobile: Design otimizado para funcionar perfeitamente em celulares e computadores.

🛠️ Tecnologias Utilizadas

Frontend: HTML5, CSS3 (com CSS Variables para temas), JavaScript (ES6+).

Backend / IA: Vercel Serverless Functions (Node.js) integrando com a Google Gemini API.

Banco de Dados: Google Firebase (Firestore) para armazenar os dados dos estados.

Hospedagem: Vercel (Frontend + Serverless Functions).

Fonte: Outfit (Google Fonts).

Ícones: Emojis nativos para leveza e compatibilidade.

🚀 Como Rodar o Projeto Localmente

Para rodar este projeto na sua máquina, você precisará do Node.js instalado e da Vercel CLI.

Clone o repositório:

git clone [https://github.com/seu-usuario/Internship-Infos.git](https://github.com/seu-usuario/Internship-Infos.git)
cd Internship-Infos


Instale a Vercel CLI (se ainda não tiver):

npm i -g vercel


Configure as Variáveis de Ambiente:

Você precisará de uma API Key do Google Gemini.

Crie um arquivo .env (ou configure no painel da Vercel ao fazer deploy) com a chave:

GEMINI_API_KEY=sua_chave_aqui


Rode o servidor de desenvolvimento:

vercel dev


O projeto estará acessível em http://localhost:3000.

📁 Estrutura de Pastas (Relevante para Deploy)

/
├── api/
│   └── gemini.js      # Serverless Function que protege a API Key e chama a IA
├── index.html         # Aplicação Frontend completa (Single File)
├── .gitignore         # Arquivos ignorados pelo Git
└── README.md          # Documentação do projeto


Nota: Arquivos como states.csv ou configurações do Firebase Hosting (firebase.json) não são necessários para o deploy na Vercel, pois os dados já estão persistidos no Firestore e a lógica de backend migrou para Serverless.

🤝 Contribuição

Este é um projeto de extensão aberto! Se você quiser contribuir:

Faça um Fork do projeto.

Crie uma Branch para sua Feature (git checkout -b feature/NovaFeature).

Faça o Commit (git commit -m 'Adicionando nova feature').

Faça o Push (git push origin feature/NovaFeature).

Abra um Pull Request.

📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar para fins educacionais.

Feito com