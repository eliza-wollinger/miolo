
# Miolo

<p align="center">
  <img src="https://img.shields.io/badge/Status-Funcional-38664B?style=for-the-badge" alt="Status funcional">
  <img src="https://img.shields.io/badge/Projeto-PIT%20II-765967?style=for-the-badge" alt="Projeto PIT II">
  <img src="https://img.shields.io/badge/Plataforma-Web-34212B?style=for-the-badge" alt="Plataforma Web">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white" alt="Firebase">
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions">
  <img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=githubpages&logoColor=white" alt="GitHub Pages">
</p>

<p align="center">
  <a href="https://eliza-wollinger.github.io/miolo/">
    <img src="https://img.shields.io/badge/ACESSAR%20A%20MIOLO-34212B?style=for-the-badge&logo=githubpages&logoColor=white" alt="Acessar a Miolo">
  </a>
</p>

A **Miolo** é um projeto de confeitaria alternativa desenvolvido como parte das atividades acadêmicas da disciplina de Projeto Integrador Transdisciplinar II (PIT II).

A proposta foi criar uma aplicação web que simulasse uma loja virtual de cupcakes, permitindo que o usuário navegasse pelos produtos, adicionasse itens ao carrinho, criasse uma conta e registrasse pedidos demonstrativos.

Além da interface, procurei implementar funcionalidades que aproximassem o projeto de uma aplicação real, incluindo autenticação, persistência de dados, gerenciamento de pedidos e testes automatizados.

O desenvolvimento também permitiu explorar práticas de engenharia de software, como separação de responsabilidades, tratamento de erros, testes em diferentes níveis e integração contínua.

---

## Sobre o projeto

A Miolo foi pensada como uma confeitaria com identidade visual própria, fugindo da estética tradicional de lojas de doces.

Optei por uma combinação de cores neutras, detalhes em tons de vinho e uma apresentação que valoriza os produtos sem comprometer a simplicidade da navegação.

Durante o desenvolvimento, procurei manter a interface intuitiva e organizar o código para permitir a inclusão de novas funcionalidades sem reconstruir a aplicação.

![Moodboard da Miolo — Confeitaria Alternativa](assets/branding/moodboard.png)

---

## Funcionalidades

Atualmente, o projeto conta com:

- Catálogo de cupcakes carregado dinamicamente pelo Cloud Firestore;
- Filtragem de produtos por categoria;
- Carrinho com ajuste de quantidades e cálculo automático do total;
- Persistência do carrinho utilizando `localStorage`;
- Cadastro e autenticação com e-mail e senha;
- Autenticação com conta Google;
- Recuperação de senha;
- Registro de pedidos demonstrativos no Cloud Firestore;
- Histórico de pedidos associado ao usuário autenticado;
- Exibição de datas, produtos, valores e status dos pedidos;
- Cancelamento de pedidos pelo usuário responsável;
- Tratamento de erros durante o carregamento de produtos e o registro de pedidos;
- Interface responsiva para diferentes tamanhos de tela.

Os pedidos ficam vinculados ao usuário autenticado. Dessa forma, ao sair e entrar novamente na conta, é possível consultar o histórico de pedidos anteriores.

O carrinho também é preservado caso ocorra uma falha no registro do pedido, evitando a perda dos produtos selecionados.

---

## Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura e semântica das páginas |
| CSS3 | Estilização, identidade visual e responsividade |
| JavaScript | Navegação, filtros, carrinho e lógica da aplicação |
| Firebase Authentication | Cadastro, login e gerenciamento de sessões |
| Cloud Firestore | Armazenamento dos produtos e pedidos |
| LocalStorage | Persistência local do carrinho |
| Vitest | Testes unitários e verificações de integração |
| jsdom | Simulação de armazenamento e ambiente de navegador |
| Playwright | Testes E2E em navegador real |
| GitHub Actions | Integração contínua e execução automatizada de testes |
| Git e GitHub | Versionamento e gerenciamento do código |
| GitHub Pages | Publicação da aplicação |

Optei por utilizar HTML, CSS e JavaScript sem frameworks de interface para trabalhar diretamente com os fundamentos do desenvolvimento web.

---

## Como funciona

### Catálogo e carrinho

Os produtos são cadastrados no Cloud Firestore e carregados dinamicamente pela aplicação.

O usuário pode visualizar os cupcakes disponíveis, filtrar por categoria e adicionar produtos ao carrinho. Os valores são calculados automaticamente conforme as quantidades selecionadas.

O carrinho utiliza o armazenamento local do navegador para preservar os itens mesmo quando a página é atualizada.

A lógica de manipulação do carrinho foi separada em funções auxiliares no arquivo `cart-utils.js`, facilitando a manutenção e a realização de testes automatizados.

### Autenticação

Para finalizar um pedido, é necessário estar autenticado.

O sistema utiliza Firebase Authentication, permitindo cadastro com e-mail e senha ou acesso por uma conta Google.

Também foi implementada a recuperação de senha.

### Pedidos

Ao finalizar uma compra demonstrativa, a aplicação registra um documento na coleção `pedidos` do Cloud Firestore.

Esse documento contém as informações dos produtos, quantidades, valores, status e identificação do usuário responsável.

Na área **Minha conta**, o usuário pode consultar os pedidos anteriores, organizados do mais recente para o mais antigo.

Também é possível cancelar pedidos conforme as regras implementadas no sistema.

O carrinho somente é limpo após a confirmação de que o pedido foi registrado com sucesso no banco de dados.

---

## Arquitetura da aplicação

A Miolo utiliza uma arquitetura web baseada em frontend estático e serviços gerenciados do Firebase.

As principais responsabilidades são distribuídas da seguinte forma:

- **Frontend:** interface, navegação, catálogo e gerenciamento do carrinho;
- **Firebase Authentication:** autenticação e identificação dos usuários;
- **Cloud Firestore:** armazenamento dos produtos e pedidos;
- **LocalStorage:** persistência temporária dos itens do carrinho;
- **GitHub Pages:** hospedagem dos arquivos estáticos;
- **GitHub Actions:** execução automatizada dos testes.

O catálogo é alimentado pelo Firestore, permitindo adicionar novos produtos ao banco de dados sem modificar diretamente o HTML da aplicação.

Essa separação também facilita a manutenção e a evolução das funcionalidades.

---

## Testes automatizados

Durante o desenvolvimento, implementei testes automatizados utilizando Vitest, jsdom e Playwright.

A suíte está organizada em três níveis, cada um com um objetivo específico.

### Testes unitários — Vitest

**9 testes automatizados**

Os testes unitários verificam funções isoladas da lógica do carrinho, incluindo:

- Adição de produtos;
- Incremento e redução de quantidades;
- Remoção de produtos;
- Tratamento de quantidades negativas;
- Cálculo de valores;
- Tratamento de produtos inexistentes ou indisponíveis;
- Preservação do objeto original do carrinho.

### Verificações de integração — Vitest e jsdom

**4 testes automatizados**

Esses testes verificam a utilização das funções auxiliares do carrinho em conjunto com armazenamento local simulado.

Os cenários incluem:

- Adição de produtos e persistência no `localStorage`;
- Recuperação de dados armazenados;
- Atualização de totais após alterações de quantidade;
- Remoção de produtos e atualização do total.

Essas verificações ainda não cobrem diretamente toda a interface da aplicação ou a comunicação com o Firestore.

### Testes E2E — Playwright

**3 testes automatizados**

Os testes de ponta a ponta utilizam Chromium para verificar comportamentos da aplicação em um navegador real.

Atualmente, os cenários cobrem:

- Carregamento da página inicial;
- Navegação até o catálogo;
- Navegação até o carrinho.

Os testes E2E atuais verificam carregamento e navegação, não o fluxo completo de autenticação ou registro de pedidos.

### Integração contínua — GitHub Actions

O projeto possui um workflow automatizado que executa os testes após alterações nas branches configuradas.

O pipeline está dividido em dois jobs:

**Unit and Integration Tests**

- Configuração do ambiente Node.js;
- Instalação das dependências;
- Execução dos testes com Vitest.

**End-to-End Tests**

- Configuração do ambiente Node.js;
- Instalação das dependências;
- Instalação do navegador Chromium;
- Execução dos testes com Playwright.

Na execução validada durante o desenvolvimento, os resultados foram:

| Tipo de teste | Aprovados |
|---|---:|
| Unitários | 9/9 |
| Integração | 4/4 |
| E2E | 3/3 |
| **Total** | **16/16** |

O pipeline permite identificar falhas automaticamente e acompanhar os resultados das alterações realizadas no repositório.

<p align="center">
  <a href="https://github.com/eliza-wollinger/miolo/actions">
    <img src="https://img.shields.io/badge/VER%20GITHUB%20ACTIONS-34212B?style=for-the-badge&logo=githubactions&logoColor=white" alt="Ver GitHub Actions">
  </a>
</p>

---

## Estrutura do projeto

A aplicação foi organizada separando os arquivos de interface, lógica, configuração e testes.

```text
miolo/
├── .github/
│   └── workflows/
│       └── tests.yml
├── assets/
│   ├── branding/
│   │   └── moodboard.png
│   └── images/
│       └── arquivos dos cupcakes
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── cart-utils.js
│   └── firebase-config.js
├── tests/
│   ├── cart.test.js
│   ├── integration/
│   │   └── cart.integration.test.js
│   └── e2e/
│       └── cart.spec.js
├── index.html
├── package.json
├── playwright.config.js
├── vitest.config.js
└── README.md
```

Os principais arquivos são:

- `index.html`: estrutura da interface;
- `css/style.css`: identidade visual e responsividade;
- `js/app.js`: catálogo, filtros, carrinho e finalização de pedidos;
- `js/auth.js`: autenticação e histórico de pedidos;
- `js/cart-utils.js`: funções auxiliares do carrinho;
- `js/firebase-config.js`: configuração de conexão com o Firebase;
- `tests/`: testes unitários, verificações de integração e testes E2E;
- `vitest.config.js`: configuração dos testes Vitest;
- `playwright.config.js`: configuração dos testes em navegador;
- `.github/workflows/tests.yml`: pipeline de integração contínua.

---

## Acessar o projeto

A aplicação está publicada no GitHub Pages:

<p align="center">
  <a href="https://eliza-wollinger.github.io/miolo/">
    <img src="https://img.shields.io/badge/ACESSAR%20A%20MIOLO-34212B?style=for-the-badge&logo=githubpages&logoColor=white" alt="Acessar a Miolo">
  </a>
</p>

### Executar localmente

Clone o repositório:

```bash
git clone https://github.com/eliza-wollinger/miolo.git
cd miolo
```

Para visualizar a aplicação, utilize um servidor HTTP local, como a extensão Live Server do VS Code.

A aplicação depende de conexão com a internet para acessar os serviços do Firebase.

### Executar os testes

Com Node.js instalado, execute:

```bash
npm install
npm test
```

Para executar separadamente:

```bash
npm run test:unit
npm run test:integration
```

Para executar os testes E2E:

```bash
npx playwright install chromium
npm run test:e2e
```

Os testes também são executados pelo GitHub Actions, sem necessidade de instalação local no computador utilizado para editar o projeto.

---

## Segurança e limitações

A Miolo é um **protótipo acadêmico** e não realiza vendas ou pagamentos reais.

O processo de finalização simula o registro de uma compra, mas não possui integração com meios de pagamento, controle de estoque comercial ou processamento de entregas.

Os preços e totais são calculados no navegador e enviados ao Firestore como dados demonstrativos.

Em uma aplicação comercial, seria necessário implementar validações de preços e pedidos em um ambiente confiável, além de integrar um serviço de pagamentos e mecanismos adicionais de segurança.

O projeto utiliza regras de segurança do Firestore para restringir operações sobre os dados dos usuários.

A suíte automatizada cobre funções do carrinho, armazenamento simulado e navegação, mas ainda não inclui testes automatizados completos de autenticação, permissões e registro de pedidos.

Essas limitações foram mantidas considerando o objetivo acadêmico e o escopo da aplicação.

---

## Decisões técnicas

Durante o desenvolvimento, algumas escolhas foram feitas considerando a proposta do projeto e a necessidade de manter sua implementação organizada.

**Desenvolvimento sem framework de interface**

Optei por utilizar JavaScript diretamente para trabalhar com manipulação do DOM, eventos, armazenamento local e integração com serviços externos.

**Utilização do Firebase**

A escolha permitiu implementar autenticação e persistência de dados sem desenvolver um backend próprio para o protótipo.

**Separação da lógica do carrinho**

As funções auxiliares foram isoladas para facilitar manutenção, reutilização e testes unitários.

**Automação de testes**

Implementei testes com Vitest e Playwright para verificar diferentes aspectos da aplicação e identificar possíveis regressões.

**Integração contínua**

Configurei o GitHub Actions para executar os testes automaticamente após alterações no código, sem depender de ferramentas instaladas localmente.

O objetivo dessas decisões foi manter o projeto compatível com seu escopo acadêmico, mas incorporar práticas de desenvolvimento que também são utilizadas em ambientes profissionais.

---

## Considerações finais

O desenvolvimento da Miolo permitiu trabalhar diferentes partes de uma aplicação web, desde a construção da interface até a integração com serviços externos.

Uma das partes mais interessantes foi conectar o carrinho à autenticação e ao banco de dados, permitindo registrar pedidos demonstrativos e posteriormente consultá-los pelo usuário.

Ao longo do projeto, também pude explorar organização de código, tratamento de erros, persistência de dados, testes automatizados e integração contínua.

A implementação dos testes e do pipeline no GitHub Actions representou uma evolução importante, permitindo validar automaticamente comportamentos da aplicação a cada alteração.

Embora o projeto ainda possa ser expandido, a versão atual já demonstra o fluxo principal de uma loja virtual, desde a escolha dos produtos até o acompanhamento dos pedidos, respeitando as limitações de um protótipo acadêmico.

---

<p align="center">
  <strong>Miolo — Confeitaria Alternativa</strong>
</p>

<p align="center">
  Projeto acadêmico PIT II · Aplicação demonstrativa · Sem pagamentos reais
</p>
