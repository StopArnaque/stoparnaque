const analyzeButton = document.querySelector("#analyzeButton");
const messageInput = document.querySelector("#messageInput");
const resultPanel = document.querySelector("#resultPanel");
const riskTitle = document.querySelector("#riskTitle");
const riskSummary = document.querySelector("#riskSummary");
const riskList = document.querySelector("#riskList");
const riskBadge = document.querySelector("#riskBadge");
const riskScoreFill = document.querySelector("#riskScoreFill");
const riskScoreText = document.querySelector("#riskScoreText");
const insightList = document.querySelector("#insightList");
const actionList = document.querySelector("#actionList");
const newsletterForm = document.querySelector("#newsletterForm");
const newsletterEmail = document.querySelector("#newsletterEmail");
const newsletterFeedback = document.querySelector("#newsletterFeedback");
const newsletterFallback = document.querySelector("#newsletterFallback");
const newsletterStatus = document.querySelector("#newsletterStatus");
const brevoEmbed = document.querySelector("#brevoEmbed");
const brevoIframe = document.querySelector("#brevoIframe");
const alertsGrid = document.querySelector("#alertsGrid");
const alertsSummaryPage = document.querySelector("#alertsSummaryPage");
const alertsList = document.querySelector("#alertsList");
const buttondownConfig = window.STOP_ARNAQUE_BUTTONDOWN || {};
const brevoConfig = window.STOP_ARNAQUE_BREVO || {};
const alertsConfig = window.STOP_ARNAQUE_ALERTS || {};

const rules = [
  {
    test: /urgent|immediat|immédiat|dernier rappel|expire|expiré|aujourd'hui|suspendu|bloque|bloqué|sous 24h/i,
    message: "Le message crée une urgence artificielle. C'est un signal classique pour te faire agir trop vite."
  },
  {
    test: /cliquez|click|lien|http|www\.|bit\.ly|tinyurl|url/i,
    message: "Le texte pousse vers un lien. Il vaut mieux vérifier l'adresse réelle avant toute ouverture."
  },
  {
    test: /mot de passe|password|code|otp|verification|vérification|confirmer votre compte|identifiant/i,
    message: "Une demande de code, de mot de passe ou d'identifiants apparaît dans le message."
  },
  {
    test: /paiement|virement|carte|frais|amende|penalite|pénalité|bitcoin|crypto/i,
    message: "Le message semble orienter vers un paiement, des frais ou des informations bancaires."
  },
  {
    test: /colis|livraison|banque|impot|impôt|cra|paypal|microsoft|apple|service client/i,
    message: "Une marque ou une institution connue est mentionnée. C'est fréquent dans les tentatives d'usurpation."
  }
];

function renderResult(level, title, summary, items) {
  resultPanel.classList.remove("risk-high", "risk-medium", "risk-low");
  resultPanel.classList.add(level);
  riskTitle.textContent = title;
  riskSummary.textContent = summary;
  riskList.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    riskList.appendChild(li);
  });
}

function revealResultPanel() {
  if (!resultPanel) {
    return;
  }

  resultPanel.classList.remove("result-panel-active");
  void resultPanel.offsetWidth;
  resultPanel.classList.add("result-panel-active");

  const bounds = resultPanel.getBoundingClientRect();
  const resultIsMostlyBelowFold = bounds.top > window.innerHeight * 0.72 || bounds.bottom > window.innerHeight;

  if (resultIsMostlyBelowFold) {
    const targetTop = Math.max(window.scrollY + bounds.top - 18, 0);

    try {
      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    } catch (error) {
      window.scrollTo(0, targetTop);
    }
  }
}

function analyzeMessage() {
  const content = messageInput.value.trim();

  if (!content) {
    renderResult(
      "risk-low",
      "Ajoute un message à lire",
      "Colle le texte d'un SMS ou d'un email pour obtenir une première lecture douce et informative.",
      ["Cette analyse reste locale et sert à te donner des repères simples."]
    );
    revealResultPanel();
    return;
  }

  const matches = rules
    .filter((rule) => rule.test.test(content))
    .map((rule) => rule.message);

  if (matches.length >= 3) {
    renderResult(
      "risk-high",
      "Plusieurs signaux méritent une vraie prudence",
      "Le message cumule des indices fréquents d'arnaque. Ne clique pas, ne paie pas et passe par le canal officiel pour vérifier.",
      matches
    );
    revealResultPanel();
    return;
  }

  if (matches.length >= 1) {
    renderResult(
      "risk-medium",
      "Prenons le temps de vérifier davantage",
      "Le texte contient au moins un élément sensible ou inhabituel. Il vaut mieux confirmer calmement par un site ou un numéro officiel.",
      matches
    );
    revealResultPanel();
    return;
  }

  renderResult(
    "risk-low",
    "Peu de signaux d'alerte détectés ici",
    "Le message ne déclenche pas les règles les plus courantes, mais il reste utile de vérifier l'expéditeur, l'URL et le contexte global.",
    [
      "Si quelque chose te paraît anormal, fais-toi confiance et prends un second avis.",
      "Une organisation sérieuse accepte que tu prennes le temps de vérifier."
    ]
  );

  revealResultPanel();
}

function analyzeMessage() {
  const content = messageInput.value.trim();

  if (!content) {
    renderResult(
      "risk-low",
      "Ajoute un message à analyser",
      "Colle le texte d'un SMS ou d'un email pour obtenir une première analyse.",
      ["Cette analyse reste locale et sert à repérer les signaux les plus courants."]
    );
    revealResultPanel();
    return;
  }

  const matches = rules
    .filter((rule) => rule.test.test(content))
    .map((rule) => rule.message);

  if (matches.length >= 3) {
    renderResult(
      "risk-high",
      "Plusieurs signaux méritent une vraie prudence",
      "Le message cumule des indices fréquents d'arnaque. Ne clique pas, ne paie pas et passe par le canal officiel pour vérifier.",
      matches
    );
    revealResultPanel();
    return;
  }

  if (matches.length >= 1) {
    renderResult(
      "risk-medium",
      "Quelques points méritent une vérification",
      "Le texte contient au moins un élément sensible ou inhabituel. Il vaut mieux confirmer par un site ou un numéro officiel.",
      matches
    );
    revealResultPanel();
    return;
  }

  renderResult(
    "risk-low",
    "Peu de signaux d'alerte détectés ici",
    "Le message ne déclenche pas les règles les plus courantes, mais il reste utile de vérifier l'expéditeur, l'URL et le contexte global.",
    [
      "Si quelque chose te paraît anormal, fais-toi confiance et prends un second avis.",
      "Une organisation sérieuse accepte que tu prennes le temps de vérifier."
    ]
  );

  revealResultPanel();
}

const enhancedRules = [
  {
    id: "urgency",
    label: "Urgence artificielle",
    points: 24,
    test: /urgent|immediat|immediatement|dernier rappel|expire|expiration|aujourd'hui|aujourdhui|suspendu|bloque|sous 24h|maintenant/,
    tokens: ["urgent", "immediat", "dernier rappel", "suspendu", "bloque", "24h", "maintenant"],
    meaning: "La pression de temps est souvent utilisée pour empêcher toute vérification.",
    actions: ["Ne clique pas tout de suite.", "Prends 30 secondes et vérifie autrement."]
  },
  {
    id: "link",
    label: "Lien ou redirection",
    points: 21,
    test: /https?:\/\/|www\.|bit\.ly|tinyurl|cliquez|clique ici|lien|url/,
    tokens: ["http", "www", "bit.ly", "tinyurl", "cliquez", "clique ici", "lien", "url"],
    meaning: "Le lien peut mener vers une fausse page de connexion, de livraison ou de paiement.",
    actions: ["N'ouvre pas le lien depuis le message.", "Passe par le vrai site ou l'application officielle."]
  },
  {
    id: "credentials",
    label: "Code ou identifiants demandés",
    points: 25,
    test: /mot de passe|password|code|otp|verification|verifier votre compte|confirmer votre compte|identifiant/,
    tokens: ["mot de passe", "password", "code", "otp", "verification", "identifiant"],
    meaning: "Une demande de code ou d'identifiants est un signal de risque élevé.",
    actions: ["Ne partage jamais un code reçu par SMS ou email.", "N'entre pas ton mot de passe depuis un lien reçu."]
  },
  {
    id: "payment",
    label: "Paiement ou frais demandés",
    points: 22,
    test: /paiement|virement|carte|frais|amende|penalite|bitcoin|crypto|montant/,
    tokens: ["paiement", "virement", "carte", "frais", "amende", "bitcoin", "crypto", "montant"],
    meaning: "Les petits montants et frais urgents servent souvent à faire baisser la vigilance.",
    actions: ["Ne paie rien depuis le message.", "Vérifie d'abord via la banque ou le vrai service."]
  },
  {
    id: "impersonation",
    label: "Marque ou institution imitée",
    points: 18,
    test: /colis|livraison|banque|impot|cra|paypal|microsoft|apple|service client|desjardins|poste canada/,
    tokens: ["colis", "livraison", "banque", "impot", "cra", "paypal", "microsoft", "apple", "desjardins", "poste canada"],
    meaning: "Le nom d'une organisation connue peut être utilisé pour inspirer confiance.",
    actions: ["Vérifie le message par un canal officiel.", "Regarde le vrai domaine avant toute action."]
  },
  {
    id: "secrecy",
    label: "Isolement ou pression émotionnelle",
    points: 14,
    test: /n'en parle a personne|n'en parlez a personne|confidentiel|urgence familiale|aide moi vite|j'ai change de numero/,
    tokens: ["confidentiel", "aide moi vite", "change de numero"],
    meaning: "Quand un message cherche à t'isoler, il devient plus difficile de prendre du recul.",
    actions: ["Demande un second avis si le message te bouscule.", "Vérifie l'identité de la personne par un autre moyen."]
  }
];

function normalizeAnalysisText(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extractMatchedTerms(normalizedContent, rule) {
  return (rule.tokens || [])
    .filter((token) => normalizedContent.includes(token))
    .slice(0, 3);
}

function renderList(target, items) {
  if (!target) {
    return;
  }

  target.innerHTML = "";

  items.forEach((item) => {
    const entry = document.createElement("li");
    entry.textContent = item;
    target.appendChild(entry);
  });
}

function renderRichResult({ levelClass, badgeClass, badgeLabel, title, summary, score, scoreText, findings, insights, actions }) {
  resultPanel.classList.remove("risk-high", "risk-medium", "risk-low");
  resultPanel.classList.add(levelClass);

  if (riskBadge) {
    riskBadge.className = `risk-badge ${badgeClass}`;
    riskBadge.textContent = badgeLabel;
  }

  riskTitle.textContent = title;
  riskSummary.textContent = summary;

  if (riskScoreFill) {
    riskScoreFill.style.width = `${Math.max(6, Math.min(score, 100))}%`;
  }

  if (riskScoreText) {
    riskScoreText.textContent = scoreText;
  }

  renderList(riskList, findings);
  renderList(insightList, insights);
  renderList(actionList, actions);
}

function buildDetailedAnalysis(content) {
  const normalizedContent = normalizeAnalysisText(content);
  const matchedRules = enhancedRules
    .map((rule) => {
      const isMatch = rule.test.test(normalizedContent);
      const evidence = extractMatchedTerms(normalizedContent, rule);

      if (!isMatch && evidence.length === 0) {
        return null;
      }

      return {
        ...rule,
        evidence
      };
    })
    .filter(Boolean);

  const signalCount = matchedRules.length;
  const score = Math.min(96, matchedRules.reduce((sum, rule) => sum + rule.points, signalCount ? 8 : 0));

  if (signalCount === 0) {
    return {
      levelClass: "risk-low",
      badgeClass: "risk-badge-low",
      badgeLabel: "Vigilance modérée",
      title: "Peu de signaux d'alerte détectés ici",
      summary: "Le message ne déclenche pas les signaux les plus courants, mais il reste utile de vérifier l'expéditeur, le lien et le contexte.",
      score,
      scoreText: "Niveau de vigilance : faible, mais une vérification reste utile",
      findings: [
        "Aucun mot de pression ou de paiement n'a été repéré dans le texte collé.",
        "Cela ne garantit pas que le message soit légitime."
      ],
      insights: [
        "Un faux message peut rester sobre et paraître crédible.",
        "Le vrai point à vérifier ensuite est souvent l'expéditeur, le domaine ou le contexte réel."
      ],
      actions: [
        "Vérifie l'adresse d'expéditeur ou le numéro utilisé.",
        "Si un lien est présent, passe par le vrai site au lieu de cliquer.",
        "Si le message te semble étrange malgré tout, demande un second avis."
      ]
    };
  }

  const matchedIds = new Set(matchedRules.map((rule) => rule.id));
  const findings = matchedRules.map((rule) => {
    const evidenceText = rule.evidence.length ? ` Indices repérés : ${rule.evidence.join(", ")}.` : "";
    return `${rule.label}.${evidenceText}`;
  });

  const insights = matchedRules.map((rule) => rule.meaning);
  const actions = [];

  if (matchedIds.has("link")) {
    actions.push("N'ouvre pas le lien depuis le message.");
  }
  if (matchedIds.has("payment")) {
    actions.push("Ne paie rien avant d'avoir confirmé par le vrai site ou la vraie banque.");
  }
  if (matchedIds.has("credentials")) {
    actions.push("Ne donne aucun code, mot de passe ou identifiant.");
  }
  actions.push("Vérifie le message par un canal officiel.");
  actions.push("Si tu as déjà cliqué ou payé, va sur la page « Que faire » tout de suite.");

  const isHighRisk = score >= 55 || signalCount >= 3 || (matchedIds.has("payment") && matchedIds.has("credentials"));

  if (isHighRisk) {
    let title = "Plusieurs signaux d'arnaque sont présents";

    if (matchedIds.has("payment") && matchedIds.has("credentials")) {
      title = "Tentative de fraude très probable";
    } else if (matchedIds.has("impersonation") && matchedIds.has("link")) {
      title = "Message à haut risque d'usurpation";
    }

    return {
      levelClass: "risk-high",
      badgeClass: "risk-badge-high",
      badgeLabel: "Risque élevé",
      title,
      summary: "Le message cumule plusieurs mécanismes classiques de fraude. Il vaut mieux ne rien ouvrir, ne rien payer et vérifier par la source officielle.",
      score,
      scoreText: `Niveau de vigilance : élevé (${signalCount} signaux repérés)`,
      findings,
      insights,
      actions: Array.from(new Set(actions))
    };
  }

  let mediumTitle = "Le message mérite une vraie vérification";

  if (matchedIds.has("link") && matchedIds.has("urgency")) {
    mediumTitle = "Lien + urgence : vérification recommandée";
  } else if (matchedIds.has("impersonation")) {
    mediumTitle = "Le message imite peut-être une organisation connue";
  }

  return {
    levelClass: "risk-medium",
    badgeClass: "risk-badge-medium",
    badgeLabel: "À vérifier",
    title: mediumTitle,
    summary: "Le texte contient au moins un élément sensible ou inhabituel. Ce n'est pas une preuve absolue, mais ce n'est pas un message à traiter à la légère.",
    score,
    scoreText: `Niveau de vigilance : moyen (${signalCount} signal${signalCount > 1 ? "aux" : ""} repéré${signalCount > 1 ? "s" : ""})`,
    findings,
    insights,
    actions: Array.from(new Set(actions))
  };
}

function analyzeMessage() {
  const content = messageInput.value.trim();

  if (!content) {
    renderRichResult({
      levelClass: "risk-low",
      badgeClass: "risk-badge-neutral",
      badgeLabel: "Prêt à analyser",
      title: "Ajoute un message à analyser",
      summary: "Colle le texte d'un SMS ou d'un email pour obtenir une réponse plus détaillée.",
      score: 0,
      scoreText: "Niveau de vigilance : en attente",
      findings: ["Aucun texte n'a encore été collé dans le vérificateur."],
      insights: ["L'analyse changera selon les signaux détectés dans le message."],
      actions: ["Colle le message complet puis lance l'analyse."]
    });
    revealResultPanel();
    return;
  }

  renderRichResult(buildDetailedAnalysis(content));
  revealResultPanel();
}

if (analyzeButton && messageInput) {
  analyzeButton.addEventListener("click", analyzeMessage);
}

function trackAnalyticsEvent(eventName, params = {}) {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    transport_type: "beacon",
    ...params
  });
}

function getCleanPath(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value, window.location.href);
    return `${url.pathname}${url.hash || ""}`;
  } catch (error) {
    return value;
  }
}

function trackPrimaryCtaClick(event) {
  const link = event.target.closest("a[href]");

  if (!link) {
    return;
  }

  const href = (link.getAttribute("href") || "").trim();

  if (!href) {
    return;
  }

  if (href === "verifier.html") {
    trackAnalyticsEvent("verify_message_click", {
      link_path: getCleanPath(href)
    });
    return;
  }

  if (href.includes("stoparnaquestudio.lemonsqueezy.com/checkout/buy/")) {
    const checkoutUrl = new URL(href, window.location.href);
    const guideLanguage = href.includes("df3fdc0a-e76d-41bc-9a3e-779cdc7e0ddb")
      ? "fr"
      : href.includes("795a84c2-5b3b-42a1-8c60-5c680c60fbdb")
        ? "en"
        : "unknown";
    trackAnalyticsEvent("guide_checkout_click", {
      guide_language: guideLanguage,
      link_host: checkoutUrl.host,
      link_path: checkoutUrl.pathname
    });
    return;
  }

  if (href === "#newsletter" || href === "index.html#newsletter") {
    trackAnalyticsEvent("newsletter_cta_click", {
      link_path: getCleanPath(href)
    });
  }
}

document.addEventListener("click", trackPrimaryCtaClick);

function setupGlobalNewsletterBar() {
  if (!document.body || !document.querySelector(".site-shell")) {
    return;
  }

  const path = window.location.pathname.split("/").pop() || "index.html";
  const allowedPages = new Set([
    "index.html",
    "verifier.html",
    "agir.html",
    "alertes.html"
  ]);

  if (!allowedPages.has(path)) {
    return;
  }

  try {
    if (window.sessionStorage.getItem("stopArnaqueNewsletterBarHidden") === "1") {
      return;
    }
  } catch (error) {
    // Ignore sessionStorage issues and continue showing the bar.
  }

  const href = path === "index.html" ? "#newsletter" : "index.html#newsletter";
  const bar = document.createElement("div");
  bar.className = "global-newsletter-bar";
  bar.setAttribute("role", "complementary");
  bar.setAttribute("aria-label", "Invitation à la newsletter");
  bar.innerHTML = `
    <div class="global-newsletter-copy">
      <span class="global-newsletter-pill">Newsletter</span>
      <p>Recevoir les alertes utiles dès qu’un nouveau guide ou une nouvelle alerte est disponible</p>
    </div>
    <div class="global-newsletter-actions">
      <a class="button button-primary" href="${href}">S'inscrire</a>
      <button class="global-newsletter-dismiss" type="button" aria-label="Masquer le bandeau newsletter">×</button>
    </div>
  `;

  const dismissButton = bar.querySelector(".global-newsletter-dismiss");

  dismissButton?.addEventListener("click", () => {
    bar.remove();
    document.body.classList.remove("has-floating-newsletter");

    try {
      window.sessionStorage.setItem("stopArnaqueNewsletterBarHidden", "1");
    } catch (error) {
      // Ignore sessionStorage issues.
    }
  });

  document.body.classList.add("has-floating-newsletter");
  document.body.appendChild(bar);
}

setupGlobalNewsletterBar();

function upsertHiddenInput(form, name, value) {
  let input = form.querySelector(`input[name="${name}"]`);

  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    form.appendChild(input);
  }

  input.value = value;
}

function setupButtondownNewsletter() {
  const username = typeof buttondownConfig.username === "string"
    ? buttondownConfig.username.trim()
    : "";
  const tag = typeof buttondownConfig.tag === "string"
    ? buttondownConfig.tag.trim()
    : "";

  if (!username || !newsletterForm || !newsletterStatus) {
    return false;
  }

  if (brevoEmbed) {
    brevoEmbed.hidden = true;
  }

  if (newsletterFallback) {
    newsletterFallback.hidden = false;
  }

  newsletterForm.action = `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(username)}`;
  newsletterForm.method = "post";

  upsertHiddenInput(newsletterForm, "embed", "1");

  if (tag) {
    upsertHiddenInput(newsletterForm, "tag", tag);
  }

  if (newsletterFeedback) {
    newsletterFeedback.hidden = true;
    newsletterFeedback.textContent = "";
  }

  newsletterStatus.textContent = "Formulaire Buttondown actif. Les nouvelles inscriptions partiront directement vers ta liste Buttondown.";
  return true;
}

function setupBrevoNewsletter() {
  const iframeUrl = typeof brevoConfig.iframeUrl === "string" ? brevoConfig.iframeUrl.trim() : "";
  const iframeHeight = Number.isFinite(Number(brevoConfig.iframeHeight))
    ? Number(brevoConfig.iframeHeight)
    : 420;

  if (!newsletterStatus) {
    return;
  }

  if (!iframeUrl) {
    newsletterStatus.textContent = "Formulaire de démonstration actif. Ajoute ton username Buttondown dans buttondown-config.js pour passer en inscription réelle.";
    return;
  }

  if (newsletterFallback) {
    newsletterFallback.hidden = true;
  }

  if (brevoEmbed && brevoIframe) {
    brevoEmbed.hidden = false;
    brevoIframe.src = iframeUrl;
    brevoIframe.style.minHeight = `${iframeHeight}px`;
  }

  newsletterStatus.textContent = "Formulaire Brevo actif. Les nouvelles inscriptions seront envoyées vers ta liste Brevo.";
}

function handleNewsletterSubmit(event) {
  event.preventDefault();

  if (!newsletterEmail || !newsletterFeedback) {
    return;
  }

  const email = newsletterEmail.value.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  newsletterFeedback.classList.remove("is-success", "is-error");

  if (!email || !isValidEmail) {
    newsletterFeedback.textContent = "Ajoute une adresse email valide pour recevoir les futures alertes.";
    newsletterFeedback.classList.add("is-error");
    return;
  }

  newsletterFeedback.textContent = "Merci. Cette maquette confirme ton inscription localement pour l'instant. On pourra brancher un vrai service email ensuite.";
  newsletterFeedback.classList.add("is-success");
  newsletterForm.reset();
}

const isButtondownActive = setupButtondownNewsletter();

if (!isButtondownActive) {
  setupBrevoNewsletter();
}

function trackNewsletterFormSubmit() {
  if (!newsletterEmail) {
    return;
  }

  const email = newsletterEmail.value.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) {
    return;
  }

  trackAnalyticsEvent("newsletter_signup_submit", {
    form_provider: isButtondownActive ? "buttondown" : "local_form"
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener("submit", trackNewsletterFormSubmit);
}

if (newsletterForm && !isButtondownActive) {
  newsletterForm.addEventListener("submit", handleNewsletterSubmit);
}

function createLink(label, href, className = "text-link", newTab = true) {
  const link = document.createElement("a");
  link.className = className;
  link.href = href;
  if (newTab) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  link.textContent = label;
  return link;
}

function renderAlertsSummary(target) {
  if (!target) {
    return;
  }

  const summary = typeof alertsConfig.summary === "string" ? alertsConfig.summary.trim() : "";

  if (!summary) {
    target.hidden = true;
    target.textContent = "";
    return;
  }

  target.hidden = false;
  target.innerHTML = "";

  const label = document.createElement("p");
  label.className = "card-kicker";
  label.textContent = "Mise a jour rapide";

  const text = document.createElement("p");
  text.textContent = summary;

  target.append(label, text);
}

function renderAlertPreviewCard(item, index) {
  const article = document.createElement("article");
  article.className = `info-card alert-card${index === 0 ? " alert-card-featured" : ""}${item.tone ? ` alert-tone-${item.tone}` : ""}`;

  if (item.tone === "warning") {
    const flash = document.createElement("div");
    flash.className = "alert-flash";
    flash.innerHTML = '<span class="alert-flash-icon">!</span><span>Alerte officielle</span>';
    article.appendChild(flash);
  }

  const top = document.createElement("div");
  top.className = "alert-card-top";

  const topic = document.createElement("p");
  topic.className = "card-tag";
  topic.textContent = item.topic || "Alerte";

  const level = document.createElement("span");
  level.className = "alert-level";
  level.textContent = item.levelLabel || "Source officielle";

  top.append(topic, level);

  const title = document.createElement("h3");
  title.textContent = item.title || "Alerte a verifier";

  const excerpt = document.createElement("p");
  excerpt.className = "alert-excerpt";
  excerpt.textContent = item.teaser || "";

  const meta = document.createElement("p");
  meta.className = "alert-meta-line";
  meta.textContent = `${item.metaLabel || "Source"} : ${item.metaValue || "A verifier"}`;

  const links = document.createElement("div");
  links.className = "alert-links";
  links.append(
    createLink("Lire l'alerte complete", `alertes.html#${item.slug || ""}`, "text-link", false),
    createLink(item.primaryLabel || "Source officielle", item.primaryUrl || "#", "text-link")
  );

  article.append(top, title, excerpt, meta, links);
  return article;
}

function renderAlertDetailCard(item) {
  const article = document.createElement("article");
  article.className = `panel alert-detail-card${item.tone ? ` alert-tone-${item.tone}` : ""}`;
  article.id = item.slug || "";

  if (item.tone === "warning") {
    const flash = document.createElement("div");
    flash.className = "alert-flash alert-flash-detail";
    flash.innerHTML = '<span class="alert-flash-icon">!</span><span>Alerte officielle</span>';
    article.appendChild(flash);
  }

  const head = document.createElement("div");
  head.className = "alert-card-top";

  const topic = document.createElement("p");
  topic.className = "card-tag";
  topic.textContent = item.topic || "Alerte";

  const level = document.createElement("span");
  level.className = "alert-level";
  level.textContent = item.levelLabel || "Source officielle";

  head.append(topic, level);

  const title = document.createElement("h2");
  title.textContent = item.title || "Alerte";

  const intro = document.createElement("p");
  intro.className = "alert-intro";
  intro.textContent = item.fullIntro || item.teaser || "";

  const watchBox = document.createElement("div");
  watchBox.className = "alert-detail-box";

  const watchTitle = document.createElement("h3");
  watchTitle.textContent = "A surveiller";

  const watchList = document.createElement("ul");
  watchList.className = "simple-list alert-full-list";

  (Array.isArray(item.watchList) ? item.watchList : []).forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    watchList.appendChild(li);
  });

  watchBox.append(watchTitle, watchList);

  const actionBox = document.createElement("div");
  actionBox.className = "alert-detail-box";

  const actionTitle = document.createElement("h3");
  actionTitle.textContent = "Bon reflexe";

  const actionText = document.createElement("p");
  actionText.textContent = item.actionText || "";

  actionBox.append(actionTitle, actionText);

  const meta = document.createElement("p");
  meta.className = "alert-meta-line";
  meta.textContent = `${item.metaLabel || "Source"} : ${item.metaValue || "A verifier"}`;

  const links = document.createElement("div");
  links.className = "alert-links";
  links.append(
    createLink(item.primaryLabel || "Source officielle", item.primaryUrl || "#", "text-link"),
    createLink(item.secondaryLabel || "Signaler la fraude", item.secondaryUrl || "#", "text-link")
  );

  article.append(head, title, intro, watchBox, actionBox, meta, links);
  return article;
}

function renderAlerts() {
  const items = Array.isArray(alertsConfig.items) ? alertsConfig.items : [];

  renderAlertsSummary(alertsSummaryPage);

  if (alertsGrid) {
    alertsGrid.innerHTML = "";

    if (!items.length) {
      const emptyCard = document.createElement("article");
      emptyCard.className = "info-card alert-card";
      emptyCard.innerHTML = "<h3>Aucune alerte affichee pour le moment</h3><p>Ajoute ou modifie les alertes dans alerts-data.js pour les faire apparaitre ici.</p>";
      alertsGrid.appendChild(emptyCard);
    } else {
      items.slice(0, 3).forEach((item, index) => {
        alertsGrid.appendChild(renderAlertPreviewCard(item, index));
      });
    }
  }

  if (alertsList) {
    alertsList.innerHTML = "";

    items.forEach((item) => {
      alertsList.appendChild(renderAlertDetailCard(item));
    });
  }
}

renderAlerts();
