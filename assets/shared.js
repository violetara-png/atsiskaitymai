// Bendri nustatymai ir pagalbinės funkcijos abiem puslapiams (index.html, admin.html)

const GH_OWNER = "violetara-png";
const GH_REPO = "atsiskaitymai";
const GH_BRANCH = "main";
const MANIFEST_PATH = "manifest.json";

const KLASES = ["6a", "6b", "7a", "7b", "8b"];

const TIPAI = {
  atsiskaitymas: { label: "Atsiskaitymo testas", emoji: "🧪", badge: "badge-atsiskaitymas" },
  treniruoklis: { label: "Treniruoklis", emoji: "🏋️", badge: "badge-treniruoklis" },
  isivertinimas: { label: "Įsivertinimas", emoji: "✅", badge: "badge-isivertinimas" },
};

const SHEETS = {
  "6a": "1I3bdyllQj6uFniZwPsLpLXsf-1e9VBn8RFW03qZ1l5M",
  "6b": "1MSQZVKqY8iAY_w417jkLeUTWqud4PVIrxe38iP6F-aE",
  "7a": "14wTSUPAcHUCDjm7ixkTof3Ifo4ji9_mOX5h6-2KV2zQ",
  "7b": "1UfF7NESnlgx7ackfgaD-1iqEm-yGt6jmzV6q5bwKtTA",
  "8b": "1KDcV0lXIOXWT_G71XsusG-7Nep2q0Z9XEnEXxWwN_lc",
};

// mmmm-mm-dd (ISO be laiko) -> "spalio 19 d." formatas
function fmtDataLt(iso) {
  const menesiai = [
    "sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio",
    "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio",
  ];
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${menesiai[m - 1]} d.`;
}

function toLocalIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// savaitės pradžios (pirmadienio) data savaitės antraštei
function savaitesEtikete(iso) {
  const d = new Date(iso + "T00:00:00");
  const pabaiga = new Date(d);
  pabaiga.setDate(d.getDate() + 4); // penktadienis
  return `${fmtDataLt(iso)} – ${fmtDataLt(toLocalIso(pabaiga))} savaitė`;
}

async function fetchManifest() {
  const res = await fetch(MANIFEST_PATH + "?t=" + Date.now());
  if (!res.ok) throw new Error("Nepavyko įkelti manifest.json");
  return res.json();
}

function groupByWeekAndClass(items) {
  const bySavaite = {};
  for (const it of items) {
    if (!bySavaite[it.savaite]) bySavaite[it.savaite] = {};
    const klase = it.klase || "visos";
    if (!bySavaite[it.savaite][klase]) bySavaite[it.savaite][klase] = [];
    bySavaite[it.savaite][klase].push(it);
  }
  return bySavaite;
}

function showToast(msg, isError) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = "toast show" + (isError ? " error" : "");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3500);
}
