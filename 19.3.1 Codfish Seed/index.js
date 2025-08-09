    // funções de contagem:
    
    function segmentWords(text) {
      return text.toLowerCase().match(/\w+/g) || [];
    }

    function segmentSentences(text) {
      return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    }

    function countWordsAccurate(text) {
      return segmentWords(text).length;
    }

        //  versão single word - DEPRECATED
        
        // function findKeywordMatches(text, keyword) {
        //   const words = segmentWords(text);
        //   const target = keyword.toLowerCase();
        //   return words.filter(w => w === target).length;
        // }

        // versão multi word com regex - DEPRECATED

        //   function findKeywordMatches(text, keyword) {
        //   const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        //   const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        //   return (text.match(regex)).length;
        // }

  // versão multi word com loop:

    function findKeywordMatches(text, keyword) {
    if (!text || !keyword) return 0;

    const words = segmentWords(text);
    const keywordWords = segmentWords(keyword);

    if (keywordWords.length === 1) {
      return words.filter(w => w === keywordWords[0]).length;
    } else {
      let matches = 0;
      for (let i = 0; i <= words.length - keywordWords.length; i++) {
        const slice = words.slice(i, i + keywordWords.length);
        if (slice.every((exp, idx) => exp === keywordWords[idx])) { // callback de .every ==> (currentElement, currentIndex, arrayItself)
          matches++;
        }
      }
      return matches;
    }
  }

    function keywordDensity(words, keywordHits) {
      return ((keywordHits / words) * 100).toFixed(2)
    }

    function countSyllables(word) {
      const clean = word
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      const matches = clean.match(/[aeiouy]+/g);
      return matches ? Math.max(1, matches.length) : 1;
    }

    function fleschKincaidReading(text) {
      const words = segmentWords(text);
      const sentences = segmentSentences(text);

      const wordCount = words.length || 1;
      const sentenceCount = sentences.length || 1;
      const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

      const score =
        248.835 -
        1.015 * (wordCount / sentenceCount) -
        84.6 * (syllableCount / wordCount);

      return {
        score: Math.round(score * 10) / 10,
      };
    }

function detectPassiveVoicePT(text) {
  // auxiliares (ser + composto)
  const AUX =
    "(?:foi|foram|era|eram|será|serao|serão|tem sido|têm sido|tinha sido|tinham sido|seria|seriam)";

  // particípios
  const PARTICIPLE =
    "[A-Za-zÀ-ÿ]+" + // root (accepts accents)
    "(?:ado|ada|ados|adas|ido|ida|idos|idas|" +  // regulares
    "to|ta|tos|tas|so|sa|sos|sas|" +             // irregulares (feito, dito, visto, posto, preso…)
    "cho|cha|chos|chas|" +                       // (escrito -> 'scrit' + 'o' covers, 'deixar'≠cho; mantemos por compat)
    "gue|gua|gues|guas)";                        // entregue / entregues

  // Opcional "sido" ('tem/tinha sido aprovado')
  const pattern = new RegExp(
    `${AUX}\\s+(?:sido\\s+)?${PARTICIPLE}`,
    "gi"
  );

  const passiveHits = Array.from(text.matchAll(pattern)).map(m => ({
    match: m[0],
    index: m.index
  }))

  const passiveDens = ((passiveHits.length / segmentWords(text).length) * 100).toFixed(2)

  return { passiveHits, passiveDens };
}

function classifyReadingLevel(text) {
  const words = text.match(/\b\w+\b/g) || [];
  const count = words.length;

  if (count < 100) return "Básico 🟢";
  if (count < 500) return "Intermédio 🟡";
  return "Avançado 🟠";
}

    function analyzeText() {
      // Zona de texto
      const input = document.getElementById("textInput").value;

      // Lógica de análise
      const words = countWordsAccurate(input);
      const sentences = segmentSentences(input).length;
      const keyword = document.getElementById("keyInput").value;
      const keywordHits = findKeywordMatches(input, keyword);
      const keywordDens = keywordDensity(words, keywordHits);
      const fleschKincaid = fleschKincaidReading(input);
      const passive = detectPassiveVoicePT(input);
      const readingLevel = classifyReadingLevel(input);

      // valores exibidos
      document.getElementById("wordCount").textContent = words;
      document.getElementById("sentenceCount").textContent = sentences;
      document.getElementById("keywordMatches").textContent = keywordHits;
      document.getElementById("keywordDensity").textContent = keywordDens;
      document.getElementById("fleschKincaid").textContent = fleschKincaid.score;
      document.getElementById("passiveVoice").textContent = passive.passiveHits.length;
      document.getElementById("passiveOcr").textContent = passive.passiveHits.map(p => p.match).join(", ");
      document.getElementById("passiveDens").textContent = passive.passiveDens;
      document.getElementById("readingLevel").textContent = readingLevel;

      // flag que faz aparecer o quadro
      document.getElementById("results").style.display = "block";
    }
    