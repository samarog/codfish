# Codfish Zero

| 🇬🇧 **English** | 🇵🇹 **Português** |
| --- | --- |
| **Codfish Zero** is a web application prototype for **SEO content optimization** in Portuguese, providing static metrics for readability, keyword density, and text structure.<br>The project has been written to work **without external dependencies** (no React, Tailwind, or third-party libraries), making it faster, leaner, and easier to maintain. | **Codfish Zero** é um protótipo de aplicação web para **otimização de conteúdo SEO** em Português, que fornece métricas de legibilidade, densidade de palavras-chave e estrutura do artigo.<br>O projeto foi desenvolvido para funcionar **sem dependências externas** (sem React, Tailwind ou bibliotecas), tornando-o mais rápido, leve e fácil de manter. |

---

| 🇬🇧 **Features** | 🇵🇹 **Funcionalidades** |
| --- | --- |
| - **SEO Analysis**<br>  - Word and character count<br>  - Percentage of long sentences<br>  - Passive voice detection<br>  - Keyword density measurement<br>  - Text structure check (paragraphs and headings)<br>  - Readability scoring<br><br>- **Automatic Suggestions**<br>  - Recommendations based on metrics<br>  - Improvements for clarity, conciseness, and SEO<br><br>- **Minimalist UI**<br>  - Light/Dark mode with smooth transitions<br>  - Contextual buttons (enabled/disabled based on input)<br>  - Metrics panel shown only when requested<br><br>- **Initial User Flow**<br>  - Modal for entering username<br>  - Session state stored in local memory during usage | - **Análise de SEO**<br>  - Contagem de palavras e caracteres<br>  - Percentagem de frases longas<br>  - Deteção de voz passiva<br>  - Medição da densidade de palavras-chave<br>  - Verificação da estrutura do texto (parágrafos e títulos)<br>  - Pontuação de legibilidade<br><br>- **Sugestões Automáticas**<br>  - Recomendações baseadas nas métricas<br>  - Melhorias para clareza, concisão e SEO<br><br>- **Interface Minimalista**<br>  - Modo claro/escuro com transições suaves<br>  - Botões contextuais (ativados/desativados conforme o texto)<br>  - Painel de métricas visível apenas quando solicitado<br><br>- **Fluxo Inicial**<br>  - Modal para introdução do nome de utilizador<br>  - Estado da sessão armazenado na memória local durante a utilização |

---

| 🇬🇧 **Project Structure** | 🇵🇹 **Estrutura do Projeto** |
| --- | --- |
| ```<br>/<br>├── index.html # Main page structure<br>├── index.css  # Styles and theming (light/dark)<br>└── index.js   # Application logic and text analysis<br>``` | ```<br>/<br>├── index.html # Estrutura principal da página<br>├── index.css  # Estilos e tema (claro/escuro)<br>└── index.js   # Lógica da aplicação e análise de texto<br>``` |

---

| 🇬🇧 **How to Use** | 🇵🇹 **Como Usar** |
| --- | --- |
| 1. **Clone or download** the files into a local folder.<br>2. Open `index.html` in your browser.<br>3. Enter your name when prompted.<br>4. Type or paste your text into the editor.<br>5. Click **Analyze** to generate metrics.<br>6. Switch themes using the light/dark mode toggle. | 1. **Clonar ou transferir** os ficheiros para uma pasta local.<br>2. Abrir `index.html` no navegador.<br>3. Introduzir o nome quando solicitado.<br>4. Escrever ou colar o texto no editor.<br>5. Clicar em **Analisar** para gerar as métricas.<br>6. Alternar o tema através do botão de modo claro/escuro. |

---

| 🇬🇧 **Technologies Used** | 🇵🇹 **Tecnologias Utilizadas** |
| --- | --- |
| - **HTML5** for structure<br>- **CSS3** for layout, variables, and transitions<br>- **JavaScript (ES6+)** for logic and DOM manipulation<br><br> > **Note:** This project runs entirely in vanilla JavaScript with no external libraries required. | - **HTML5** para estrutura<br>- **CSS3** para layout, variáveis e transições<br>- **JavaScript (ES6+)** para lógica e manipulação do DOM<br><br> > **Nota:** Este projeto é executado inteiramente em JavaScript puro, sem bibliotecas externas. |

---

| 🇬🇧 **Optimization Decisions** | 🇵🇹 **Decisões de Otimização** |
| --- | --- |
| - **Zero Dependencies:** native JS/CSS to reduce complexity and page weight.<br>- **Custom `createElement` helper:** to simplify dynamic DOM creation.<br>- **Theme toggling via `dark` class on `<body>`:** clean and easy styling switch.<br>- **Conditional metrics panel:** rendered only when needed to improve performance. | - **Zero dependências:** uso de JS/CSS nativo para reduzir complexidade e peso da página.<br>- **Função personalizada `createElement`:** simplifica a criação dinâmica de elementos DOM.<br>- **Alternância de tema via classe `dark` no `<body>`:** método simples e limpo para mudar estilos.<br>- **Painel de métricas condicional:** renderizado apenas quando necessário para melhor desempenho. |

---

| 🇬🇧 **License** | 🇵🇹 **Licença** |
| --- | --- |
| This project is part of a released product. **For demonstration purposes only.** | Este projeto faz parte de um produto lançado. **Apenas para fins de demonstração.** |
