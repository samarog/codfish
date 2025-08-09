/*
 * Codfish Kiwi – Simplified Portuguese SEO and readability analyzer.
 */

(() => {
  /*
   * The application code is self-contained; any initialisation logic
   * begins here. The debug overlay that was previously used for
   * troubleshooting has been removed for the final version.
   */
  // State management: all mutable values live in this object. The
  // render() function reads from state to build the UI.  When
  // updating state, call render() to reflect the changes on screen.

  const state = {
    username: null,
    theme: "light",
    text: "",
    showAnalytics: false,
  };

  // Reference to the root container where the app will be mounted.
  const root = document.getElementById("root");

  // Load persisted theme from localStorage and apply it to the body.
  const storedTheme = localStorage.getItem("analytics-ui-theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    state.theme = storedTheme;
    if (storedTheme === "dark") {
      document.body.classList.add("dark");
    }
  }

  // Helper functions for text analysis
  function segmentWords(text) {
    if (!text || typeof text !== "string") return [];
    // Use Intl.Segmenter if available for better word segmentation
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      try {
        const segmenter = new Intl.Segmenter("pt", { granularity: "word" });
        const words = Array.from(segmenter.segment(text))
          .filter((seg) => seg.isWordLike)
          .map((seg) => seg.segment.trim().toLowerCase())
          .filter((w) => w.length > 0 && /[a-záàâãéèêíìîóòôõúùûç]/i.test(w));
        if (words.length > 0) return words;
      } catch (e) {
        // ignore and fall back to regex split
      }
    }
    return text
      .toLowerCase()
      .replace(/[^\w\sáàâãéèêíìîóòôõúùûç]/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length > 0 && /[a-záàâãéèêíìîóòôõúùûç]/i.test(w));
  }

  function segmentSentences(text) {
    if (!text) return [];
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      try {
        const segmenter = new Intl.Segmenter("pt", { granularity: "sentence" });
        const sentences = Array.from(segmenter.segment(text))
          .map((seg) => seg.segment.trim())
          .filter((sentence) => {
            const clean = sentence.replace(/[\s\n\r\t]+/g, " ").trim();
            if (/^#{1,6}\s+/.test(clean)) return false;
            return (
              clean.length > 8 &&
              clean.split(/\s+/).length >= 3 &&
              (/[.!?:]$/.test(clean) || clean.length > 20)
            );
          });
        if (sentences.length > 0) return sentences;
      } catch (e) {
        // fall back to regex below
      }
    }
    let processed = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    processed = processed.replace(/^#{1,6}\s+[^\n]*$/gm, "");
    const sentences = processed
      .split(/(?<![A-Z][a-z]\.)\s*[.!?:]+\s*(?=[A-Z]|$)/)
      .map((s) => s.trim())
      .filter((sentence) => {
        const clean = sentence.replace(/[\s\n\r\t]+/g, " ").trim();
        const words = clean.split(/\s+/);
        if (/^#{1,6}\s+/.test(clean)) return false;
        return (
          clean.length > 8 &&
          words.length >= 3 &&
          words.length <= 200 &&
          /[a-záàâãéèêíìîóòôõúùûç]/i.test(clean)
        );
      });
    return sentences;
  }

  function countSyllables(text) {
    const words = segmentWords(text);
    let total = 0;
    words.forEach((word) => {
      const vowelGroups = word.match(/[aeiouáàâãéèêíìîóòôõúùû]+/gi) || [];
      let syl = vowelGroups.length;
      if (word.match(/[aeiou]e$/i)) syl--;
      if (syl === 0) syl = 1;
      total += syl;
    });
    return total;
  }

  function findKeywordMatches(text, keyword) {
    if (!keyword || !text) return 0;
    const normalizedText = text.toLowerCase();
    const normalizedKeyword = keyword.toLowerCase();
    const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "g");
    const matches = normalizedText.match(regex);
    return matches ? matches.length : 0;
  }

  function extractMainKeyword(text) {
    const words = segmentWords(text);
    const freq = {};
    const common = new Set([
      "de",
      "a",
      "o",
      "e",
      "da",
      "do",
      "em",
      "um",
      "para",
      "com",
      "não",
      "uma",
      "os",
      "no",
      "se",
      "na",
      "por",
      "mais",
      "as",
      "dos",
      "como",
      "mas",
      "foi",
      "ao",
      "ele",
      "das",
      "tem",
      "à",
      "seu",
      "sua",
      "ou",
      "ser",
      "quando",
      "muito",
      "há",
      "nos",
      "já",
      "está",
      "eu",
      "também",
      "só",
      "pelo",
      "pela",
      "até",
      "isso",
      "ela",
      "entre",
    ]);
    words.forEach((word) => {
      if (word.length > 3 && !common.has(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });
    const sorted = Object.entries(freq).sort(([, a], [, b]) => b - a);
    return sorted.length > 0 ? sorted[0][0] : "";
  }

  function computeAnalytics(text) {
    const wordCount = segmentWords(text).length;
    const characterCount = text.length;
    const characterCountNoSpaces = text.replace(/\s/g, "").length;
    const sentences = segmentSentences(text);
    const sentenceCount = sentences.length;
    const averageWordsPerSentence =
      sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const paragraphCount = paragraphs.length;
    const headingMatches = {
      h1: (text.match(/^# /gm) || []).length,
      h2: (text.match(/^## /gm) || []).length,
      h3: (text.match(/^### /gm) || []).length,
      h4: (text.match(/^#### /gm) || []).length,
      h5: (text.match(/^##### /gm) || []).length,
      h6: (text.match(/^###### /gm) || []).length,
    };
    const totalHeadings = Object.values(headingMatches).reduce(
      (a, b) => a + b,
      0
    );
    const longSentences = sentences.filter(
      (sentence) => segmentWords(sentence).length > 25
    );
    const longSentencesPercentage =
      sentenceCount > 0 ? (longSentences.length / sentenceCount) * 100 : 0;
    const passiveVoicePatterns = [
      /\b(foi|foram|é|são|está|estão|será|serão|seria|seriam|fosse|fossem)\s+(?:[a-zç]+mente\s+)?\w+(?:ado|ida|idos|idas)\b/gi,
      /\b(tem|têm|tinha|tinham|terá|terão|teria|teriam|havia|haviam|houve)\s+sido\s+(?:[a-zç]+mente\s+)?\w+(?:ado|ida|idos|idas)\b/gi,
    ];
    let passiveCount = 0;
    passiveVoicePatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) passiveCount += matches.length;
    });
    const passiveVoicePercentage =
      sentenceCount > 0 ? (passiveCount / sentenceCount) * 100 : 0;
    const syllableCount = countSyllables(text);
    const fleschKincaidGrade =
      sentenceCount > 0 && wordCount > 0
        ? parseFloat(
            (
              0.39 * (wordCount / sentenceCount) +
              11.8 * (syllableCount / wordCount) -
              15.59
            ).toFixed(1)
          )
        : 0;
    const contentStructureScore = Math.min(
      100,
      Math.max(
        0,
        50 +
          totalHeadings * 5 +
          (paragraphCount > 3 ? 15 : paragraphCount * 5) +
          (wordCount > 300 ? 15 : 0) +
          (wordCount > 600 ? 15 : 0)
      )
    );
    let readabilityScore = 100;
    if (fleschKincaidGrade > 16) readabilityScore -= 16;
    else if (fleschKincaidGrade > 12) readabilityScore -= 5;
    else if (fleschKincaidGrade <= 8) readabilityScore += 3.5;
    if (averageWordsPerSentence > 30) readabilityScore -= 15;
    else if (averageWordsPerSentence > 25) readabilityScore -= 10;
    else if (averageWordsPerSentence > 20) readabilityScore -= 5;
    else if (averageWordsPerSentence <= 20) readabilityScore += 5.5;
    if (longSentencesPercentage > 25) readabilityScore -= 11;
    else if (longSentencesPercentage < 10) readabilityScore += 10;
    if (passiveVoicePercentage >= 15) readabilityScore -= 8;
    else if (passiveVoicePercentage < 8) readabilityScore += 3;
    readabilityScore = Math.max(0, Math.min(100, readabilityScore));
    const keyword = extractMainKeyword(text);
    const keywordCount = findKeywordMatches(text, keyword);
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
    const keywordDensity = {
      keyword,
      count: keywordCount,
      density: parseFloat(density.toFixed(2)),
    };
    const mainTitleMatch = text.match(/^#\s(.+)$/m);
    const mainTitle = mainTitleMatch ? mainTitleMatch[1] : "";
    const firstParagraph = paragraphs[0] || "";
    const focusKeywordUsage = {
      keyword,
      inTitle:
        keyword && mainTitle.toLowerCase().includes(keyword.toLowerCase()),
      inFirstParagraph:
        keyword && firstParagraph.toLowerCase().includes(keyword.toLowerCase()),
      density: keywordDensity.density,
    };
    const complexity = { simple: 0, complex: 0, veryComplex: 0 };
    sentences.forEach((sentence) => {
      const wc = segmentWords(sentence).length;
      if (wc <= 15) complexity.simple++;
      else if (wc <= 25) complexity.complex++;
      else complexity.veryComplex++;
    });
    return {
      wordCount,
      characterCount,
      characterCountNoSpaces,
      sentenceCount,
      averageWordsPerSentence: parseFloat(averageWordsPerSentence.toFixed(1)),
      paragraphCount,
      headingAnalysis: { ...headingMatches, totalHeadings },
      longSentencesPercentage: parseFloat(longSentencesPercentage.toFixed(1)),
      passiveVoicePercentage: parseFloat(passiveVoicePercentage.toFixed(1)),
      fleschKincaidGrade,
      contentStructureScore,
      readabilityScore: parseFloat(readabilityScore.toFixed(1)),
      keywordDensity,
      focusKeywordUsage,
      complexity,
    };
  }

  function generateSuggestions(analytics) {
    const suggestions = [];
    if (!analytics) return suggestions;
    const {
      fleschKincaidGrade,
      readabilityScore,
      longSentencesPercentage,
      passiveVoicePercentage,
      paragraphCount,
      headingAnalysis,
      keywordDensity,
      focusKeywordUsage,
      contentStructureScore,
    } = analytics;
    if (readabilityScore < 60 || fleschKincaidGrade > 16) {
      suggestions.push(
        "Melhore a legibilidade utilizando frases mais curtas e linguagem simples."
      );
    }
    if (longSentencesPercentage > 25) {
      suggestions.push(
        "Reduza o número de frases longas, dividindo‑as em frases menores."
      );
    }
    if (passiveVoicePercentage > 15) {
      suggestions.push("Reduza o uso de voz passiva e prefira a voz activa.");
    }
    if (paragraphCount < 3) {
      suggestions.push(
        "Acrescente mais parágrafos para estruturar melhor o texto."
      );
    }
    if (headingAnalysis.h1 === 0) {
      suggestions.push("Adicione um título principal (H1) ao conteúdo.");
    }
    if (headingAnalysis.h2 === 0) {
      suggestions.push("Inclua subtítulos (H2) para organizar os tópicos.");
    }
    if (contentStructureScore < 60) {
      suggestions.push(
        "Melhore a estrutura do conteúdo com mais títulos e parágrafos."
      );
    }
    if (keywordDensity.density < 0.5) {
      suggestions.push(
        "A densidade da palavra‑chave está baixa; use a keyword mais vezes."
      );
    } else if (keywordDensity.density > 3) {
      suggestions.push(
        "A densidade da palavra‑chave está alta; reduza as repetições."
      );
    }
    if (focusKeywordUsage.keyword && !focusKeywordUsage.inTitle) {
      suggestions.push("Inclua a palavra‑chave no título principal.");
    }
    if (focusKeywordUsage.keyword && !focusKeywordUsage.inFirstParagraph) {
      suggestions.push("Introduza a palavra‑chave no primeiro parágrafo.");
    }
    return suggestions;
  }

  // Helper to create DOM elements with attributes and children.
  function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const key in attrs) {
      if (key === "class") {
        el.className = attrs[key];
      } else if (key === "text") {
        el.textContent = attrs[key];
      } else if (key.startsWith("on") && typeof attrs[key] === "function") {
        const eventType = key.slice(2).toLowerCase();
        el.addEventListener(eventType, attrs[key]);
      } else {
        el.setAttribute(key, attrs[key]);
      }
    }
    if (!Array.isArray(children)) children = [children];
    children.forEach((child) => {
      if (child != null) el.append(child);
    });
    return el;
  }

  // Main render function.  Clears the root container and builds the
  // interface based on current state.
  function render() {
    root.innerHTML = "";
    // Theme toggle button
    const themeContainer = createElement("div", { class: "theme-toggle" });
    const themeButton = createElement("button", {
      text: state.theme === "light" ? "🌙" : "☀️",
      onclick: () => {
        state.theme = state.theme === "light" ? "dark" : "light";
        document.body.classList.toggle("dark", state.theme === "dark");
        localStorage.setItem("analytics-ui-theme", state.theme);
        // Update button text without full re-render
        themeButton.textContent = state.theme === "light" ? "🌙" : "☀️";
      },
    });
    themeContainer.append(themeButton);
    root.append(themeContainer);
    // Username modal
    if (!state.username) {
      const overlay = createElement("div", { class: "modal-overlay" });
      const modal = createElement("div", { class: "modal" });
      modal.append(
        createElement("h2", { text: "Introduza o seu nome de utilizador" })
      );
      const input = createElement("input", { type: "text", value: "" });
      input.addEventListener("input", (e) => {
        input.value = e.target.value;
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          confirmUsername();
        }
      });
      function confirmUsername() {
        const trimmed = input.value.trim();
        if (trimmed) {
          state.username = trimmed;
          render();
        }
      }
      modal.append(input);
      const confirmBtn = createElement("button", {
        text: "Confirmar",
        onclick: confirmUsername,
      });
      modal.append(confirmBtn);
      overlay.append(modal);
      root.append(overlay);
      return;
    }
    // Main container
    const container = createElement("div", { class: "container" });
    // Header
    const header = createElement("div", { class: "header" });
    header.append(createElement("h1", { text: "Codfish Zero" }));
    header.append(
      createElement("p", {
        text: "Software de análise de SEO e legibilidade de textos",
      })
    );
    container.append(header);
    // Grid
    const grid = createElement("div", { class: "grid" });
    // Left panel: text input
    const leftCard = createElement("div", { class: "card" });
    leftCard.append(createElement("h2", { text: "Texto para análise:" }));
    const textarea = createElement("textarea", {
      class: "textarea",
      placeholder: "Cole aqui o seu texto em linguagem markdown...",
    });
    textarea.value = state.text;
    textarea.addEventListener("input", (e) => {
      state.text = e.target.value;
      // Update character count on the fly
      charCountSpan.textContent = state.text.length + " caracteres";
      // Enable or disable buttons based on text presence
      clearBtn.disabled = !state.text.trim();
      analyzeBtn.disabled = !state.text.trim();
    });
    leftCard.append(textarea);
    // Actions
    const actions = createElement("div", { class: "actions" });
    const leftActions = createElement("div", { class: "left" });
    const charCountSpan = createElement("span", {
      text: state.text.length + " caracteres",
    });
    leftActions.append(charCountSpan);
    const rightActions = createElement("div", { class: "right" });
    const clearBtn = createElement("button", {
      class: "button secondary",
      text: "Limpar",
      disabled: !state.text.trim(),
      onclick: () => {
        state.text = "";
        state.showAnalytics = false;
        render();
      },
    });
    const analyzeBtn = createElement("button", {
      class: "button primary",
      text: "Analisar",
      disabled: !state.text.trim(),
      onclick: () => {
        if (state.text.trim()) {
          state.showAnalytics = true;
          render();
        }
      },
    });
    rightActions.append(clearBtn, analyzeBtn);
    actions.append(leftActions, rightActions);
    leftCard.append(actions);
    grid.append(leftCard);
    // Right panel: placeholder or hide button
    const rightPanel = createElement("div", { class: "card" });
    if (state.showAnalytics && state.text.trim()) {
      const hideBtn = createElement("button", {
        class: "button secondary",
        text: "Ocultar painel",
        onclick: () => {
          state.showAnalytics = false;
          render();
        },
      });
      rightPanel.append(hideBtn);
    } else {
      const placeholder = createElement("div", { class: "placeholder" });
      placeholder.append(
        createElement("div", { class: "placeholder-icon", text: "📊" })
      );
      placeholder.append(createElement("h3", { text: "Análise não iniciada" }));
      placeholder.append(
        createElement("p", {
          text: 'Cole o texto e clique em "Analisar" para ver as métricas de SEO',
          style: "font-size:0.85rem; color: var(--muted-light);",
        })
      );
      rightPanel.append(placeholder);
    }
    grid.append(rightPanel);
    container.append(grid);
    root.append(container);
    // Show analytics overlay if needed. Wrap in try/catch to surface errors
    if (state.showAnalytics && state.text.trim()) {
      try {
        showAnalyticsOverlay(state.text);
      } catch (err) {
        // Log errors to the console during development.  In
        // production the overlay simply will not show if an
        // error occurs.
        console.error(err);
      }
    }
  }

  // Build and display the analytics panel overlay.  Computes the
  // analysis once and constructs DOM nodes to show metrics and
  // suggestions.  Accepts the analyzed text as an argument.
  function showAnalyticsOverlay(text) {
    // First remove any existing overlay
    const existing = document.querySelector(".analytics-overlay");
    if (existing) existing.remove();
    const analytics = computeAnalytics(text);
    const suggestions = generateSuggestions(analytics);
    // Overlay
    const overlay = createElement("div", { class: "analytics-overlay" });
    const panel = createElement("div", { class: "analytics-panel" });
    // Title with close button
    const header = createElement("h2");
    const titleSpan = createElement("span", { text: "Painel de Análise SEO" });
    const closeBtn = createElement("button", {
      text: "✖️",
      onclick: () => {
        state.showAnalytics = false;
        render();
      },
    });
    header.append(titleSpan, closeBtn);
    panel.append(header);
    // Metrics grid
    const grid = createElement("div", { class: "metrics-grid" });
    function addMetric(label, value, extraText, colorClass) {
      const card = createElement("div", { class: "metric-card" });
      card.append(createElement("div", { class: "label", text: label }));
      const valueElem = createElement("div", { class: "value", text: value });
      if (colorClass) {
        valueElem.style.color = colorClass;
      }
      card.append(valueElem);
      if (extraText) {
        card.append(createElement("div", { class: "extra", text: extraText }));
      }
      grid.append(card);
    }
    // Determine colors for scores
    function scoreColor(score) {
      if (score >= 80) return "var(--green, #16a34a)";
      if (score >= 60) return "var(--yellow, #ca8a04)";
      if (score >= 40) return "var(--orange, #ea580c)";
      return "var(--red, #dc2626)";
    }
    function percentColor(pct) {
      if (pct <= 10) return "var(--green, #16a34a)";
      if (pct <= 20) return "var(--yellow, #ca8a04)";
      if (pct <= 30) return "var(--orange, #ea580c)";
      return "var(--red, #dc2626)";
    }
    // Word count
    addMetric("Palavras", analytics.wordCount);
    // Characters
    addMetric(
      "Caracteres",
      analytics.characterCount,
      "Sem espaços: " + analytics.characterCountNoSpaces
    );
    // Sentences
    addMetric(
      "Frases",
      analytics.sentenceCount,
      "Média: " + analytics.averageWordsPerSentence + " palavras"
    );
    // Paragraphs and headings
    addMetric(
      "Parágrafos",
      analytics.paragraphCount,
      "Títulos: " + analytics.headingAnalysis.totalHeadings
    );
    // Readability
    addMetric(
      "Legibilidade",
      analytics.readabilityScore,
      "Flesch-Kincaid: " + analytics.fleschKincaidGrade,
      scoreColor(analytics.readabilityScore)
    );
    // Passive voice
    addMetric(
      "Voz Passiva",
      analytics.passiveVoicePercentage.toFixed(1) + "%",
      analytics.passiveVoicePercentage <= 8
        ? "Excelente"
        : analytics.passiveVoicePercentage <= 15
        ? "Aceitável"
        : "Elevada",
      percentColor(analytics.passiveVoicePercentage)
    );
    // Long sentences
    addMetric(
      "Frases Longas",
      analytics.longSentencesPercentage.toFixed(1) + "%",
      "média " + analytics.averageWordsPerSentence + " palavras/frase",
      percentColor(analytics.longSentencesPercentage)
    );
    // Content structure
    addMetric(
      "Estrutura",
      analytics.contentStructureScore,
      analytics.paragraphCount +
        " parágrafos, " +
        analytics.headingAnalysis.totalHeadings +
        " títulos",
      scoreColor(analytics.contentStructureScore)
    );
    // Keyword density
    let densityColor;
    if (
      analytics.keywordDensity.density >= 1 &&
      analytics.keywordDensity.density <= 1.5
    )
      densityColor = "var(--green, #16a34a)";
    else if (
      analytics.keywordDensity.density < 0.5 ||
      analytics.keywordDensity.density > 3
    )
      densityColor = "var(--red, #dc2626)";
    else densityColor = "var(--yellow, #ca8a04)";
    addMetric(
      "Densidade Keyword",
      analytics.keywordDensity.density.toFixed(2) + "%",
      'Keyword: "' + analytics.keywordDensity.keyword + '"',
      densityColor
    );
    // Complexity distribution
    // Determine max category for coloring
    const maxComplex = Math.max(
      analytics.complexity.simple,
      analytics.complexity.complex,
      analytics.complexity.veryComplex
    );
    addMetric(
      "Complexidade",
      maxComplex,
      analytics.complexity.simple +
        " simples / " +
        analytics.complexity.complex +
        " equilibradas / " +
        analytics.complexity.veryComplex +
        " complexas",
      "var(--blue, #2563eb)"
    );
    panel.append(grid);
    // Focus keyword section
    if (analytics.focusKeywordUsage.keyword) {
      const fk = createElement("div", { class: "focus-keyword" });
      fk.append(createElement("h3", { text: "Análise de Keyword Principal" }));
      fk.append(
        createElement("p", {
          text:
            'Palavra‑chave identificada: "' +
            analytics.focusKeywordUsage.keyword +
            '"',
        })
      );
      const list = createElement("ul");
      list.append(
        createElement("li", {
          text:
            (analytics.focusKeywordUsage.inTitle ? "Aparece" : "Não aparece") +
            " no título principal",
        })
      );
      list.append(
        createElement("li", {
          text:
            (analytics.focusKeywordUsage.inFirstParagraph
              ? "Aparece"
              : "Não aparece") + " no primeiro parágrafo",
        })
      );
      list.append(
        createElement("li", {
          text:
            "Densidade no texto: " +
            analytics.focusKeywordUsage.density.toFixed(2) +
            "%",
        })
      );
      fk.append(list);
      panel.append(fk);
    }
    // Suggestions
    if (suggestions.length > 0) {
      const sugDiv = createElement("div", { class: "suggestions" });
      sugDiv.append(createElement("h3", { text: "Sugestões de Melhoria" }));
      const ul = createElement("ul");
      suggestions.forEach((s) => {
        ul.append(createElement("li", { text: s }));
      });
      sugDiv.append(ul);
      panel.append(sugDiv);
    }
    overlay.append(panel);
    root.append(overlay);
  }
  // Initial render
  render();
})();
