const analyzeButton = document.querySelector("#analyzeButton");
const messageInput = document.querySelector("#messageInput");
const resultPanel = document.querySelector("#resultPanel");
const riskTitle = document.querySelector("#riskTitle");
const riskSummary = document.querySelector("#riskSummary");
const riskList = document.querySelector("#riskList");
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

if (analyzeButton && messageInput) {
  analyzeButton.addEventListener("click", analyzeMessage);
}

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
