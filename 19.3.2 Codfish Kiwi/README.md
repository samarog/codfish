# Codfish - Build de Desenvolvimento

## Sobre este Build

Este é um build estático **NÃO MINIFICADO** do Codfish, criado especificamente para permitir edições fáceis no código.

## Características

- **CSS não minificado**: Arquivo `assets/index.css` mantém formatação legível
- **JavaScript não minificado**: Arquivo `assets/index.js` mantém variáveis e funções com nomes originais
- **Source maps**: Incluídos para debug mais fácil
- **Estrutura preservada**: Nomes de arquivos e chunks mantidos simples

## Como Usar

### Teste Local
```bash
# Servir arquivos estáticos
python -m http.server 8000
# ou
npx serve .
```

### Regenerar Build

Se precisar regenerar este build:
```bash
npm run build:dev-static
```

## Estrutura de Arquivos

```
19.3 Codfish Light/
├── index.html     
├── index.css      # Tailwind (não minificado)
├── index.js       # JavaScript (não minificado)
├── assets/
│   ├── bg.png
│   └── favicon.svg    
├── README.md     
└── DEPLOY.md      
```

## Diferenças do Build de Produção

- **Tamanho**: ~3x maior que o build minificado
- **Velocidade**: Ligeiramente mais lento para carregar
- **Editabilidade**: Muito mais fácil de editar e debug

## Funcionalidades Incluídas

- ✅ Análise SEO completa em português
- ✅ Cálculo de densidade de palavras-chave
- ✅ Métricas de legibilidade
- ✅ Análise de estrutura de conteúdo
- ✅ Modo escuro/claro
- ✅ Funciona 100% offline
