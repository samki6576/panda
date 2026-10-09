(function () {
  const script = document.currentScript;
  if (!script || !script.src) return;

  const scriptUrl = new URL(script.src, document.baseURI);
  const marketId = scriptUrl.searchParams.get("market");
  if (!marketId) return;

  const appUrl = new URL(script.dataset.appUrl || scriptUrl.origin);
  const container = document.createElement("div");
  container.style.cssText =
    "border:1px solid #2A2A2A;border-radius:12px;padding:20px;max-width:420px;font-family:Arial,sans-serif;background:#161616;color:#FFFFFF;";

  const label = document.createElement("p");
  label.textContent = "Prediction Market";
  label.style.cssText = "margin:0 0 8px;font-size:12px;color:#AAAAAA;text-transform:uppercase;";

  const question = document.createElement("p");
  question.textContent = "Loading market…";
  question.style.cssText = "margin:0 0 20px;font-size:18px;font-weight:600;";

  const choices = document.createElement("div");
  choices.style.cssText = "display:flex;gap:12px;";

  ["YES", "NO"].forEach((side) => {
    const link = document.createElement("a");
    link.href = new URL(
      "/trade/" + encodeURIComponent(marketId) + "?side=" + side,
      appUrl
    ).toString();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = side;
    link.style.cssText =
      "flex:1;padding:14px;border-radius:8px;background:" +
      (side === "YES" ? "#22C55E" : "#EF4444") +
      ";color:#FFFFFF;font-weight:700;font-size:16px;text-align:center;text-decoration:none;";
    choices.appendChild(link);
  });

  container.append(label, question, choices);
  script.parentNode.insertBefore(container, script);

  fetch(new URL("/api/markets/" + encodeURIComponent(marketId) + "/price", appUrl))
    .then((response) => {
      if (!response.ok) throw new Error("Market unavailable");
      return response.json();
    })
    .then((data) => {
      question.textContent =
        typeof data.question === "string" ? data.question : "Prediction market";
      ["YES", "NO"].forEach((side, index) => {
        const price = side === "YES" ? data.yesPrice : data.noPrice;
        const link = choices.children[index];
        if (typeof price === "number" && Number.isFinite(price)) {
          link.textContent = side + " " + Math.round(price * 100) + "%";
        }
      });
    })
    .catch(() => {
      question.textContent = "Market details are currently unavailable.";
    });
})();
