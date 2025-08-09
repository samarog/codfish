# Codfish Kiwi - Development Build

| 🇬🇧 **English** | 🇵🇹 **Português** |
| --- | --- |
| ## About this Build<br>This is a static **NON-MINIFIED** build of Codfish, created specifically to allow easy code editing. | ## Sobre este Build<br>Este é um build estático **NÃO MINIFICADO** do Codfish, criado especificamente para permitir edições fáceis no código. |

---

| 🇬🇧 **Features** | 🇵🇹 **Características** |
| --- | --- |
| - **Non-minified CSS**: `assets/index.css` keeps readable formatting<br>- **Non-minified JavaScript**: `assets/index.js` keeps original variable and function names<br>- **Source maps**: Included for easier debugging<br>- **Preserved structure**: File and chunk names kept simple | - **CSS não minificado**: Arquivo `assets/index.css` mantém formatação legível<br>- **JavaScript não minificado**: Arquivo `assets/index.js` mantém variáveis e funções com nomes originais<br>- **Source maps**: Incluídos para debug mais fácil<br>- **Estrutura preservada**: Nomes de arquivos e chunks mantidos simples |

---

| 🇬🇧 **How to Use** | 🇵🇹 **Como Usar** |
| --- | --- |

### Local Test
> Serve static files:
  ```bash
  python -m http.server 8000
```
OR
```
npx serve .
```
### Regenerate Build
> If you need to regenerate this build:
```
npm run build:dev-static
```

---

| 🇬🇧 **Differences from Production Build** | 🇵🇹 **Diferenças do Build de Produção** |
| --- | --- |
| - **Size**: ~3x larger than minified build<br>- **Speed**: Slightly slower to load<br>- **Editability**: Much easier to edit and debug | - **Tamanho**: ~3x maior que o build minificado<br>- **Velocidade**: Ligeiramente mais lento a carregar<br>- **Editabilidade**: Muito mais fácil de editar e debug |

---

| 🇬🇧 **Included Features** | 🇵🇹 **Funcionalidades Incluídas** |
| --- | --- |
| - ✅ Full SEO analysis in Portuguese<br>- ✅ Keyword density calculation<br>- ✅ Readability metrics<br>- ✅ Content structure analysis<br>- ✅ Dark/Light mode<br>- ✅ Works 100% offline | - ✅ Análise SEO completa em português<br>- ✅ Cálculo de densidade de palavras-chave<br>- ✅ Métricas de legibilidade<br>- ✅ Análise de estrutura de conteúdo<br>- ✅ Modo escuro/claro<br>- ✅ Funciona 100% offline |
