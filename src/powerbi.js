import { PublicClientApplication } from "@azure/msal-browser";

const settings = window.POWERBI_CONFIG || {};
const colors = ["#2da38f", "#2774c8", "#f28a27", "#39a0ec", "#7954da", "#21836b"];
const apiRoot = "https://api.powerbi.com/v1.0/myorg";
let msalApp;

const clientSummaryDax = `
EVALUATE
SUMMARIZECOLUMNS(
  'Clienti_Unificati'[Perimetro],
  "ClientiTarget", SUM('Clienti_Unificati'[ClientiTarget]),
  "ClientiVinti", SUM('Clienti_Unificati'[ClientiVinti]),
  "ClientiConOfferta", SUM('Clienti_Unificati'[ClientiConOfferta]),
  "RTCensite", SUM('Clienti_Unificati'[RTCensite]),
  "RTSelezionate", SUM('Clienti_Unificati'[RTSelezionate]),
  "RTDaVerificare", SUM('Clienti_Unificati'[RTDaVerificare]),
  "Offerte", SUM('Clienti_Unificati'[Offerte]),
  "OfferteInCorso", SUM('Clienti_Unificati'[OfferteInCorso]),
  "OfferteVinte", SUM('Clienti_Unificati'[OfferteVinte]),
  "StimaHardwareEUR", SUM('Clienti_Unificati'[StimaHardwareEUR]),
  "StimaServiziEUR", SUM('Clienti_Unificati'[StimaServiziEUR]),
  "ValoreHardwareVinteEUR", SUM('Clienti_Unificati'[ValoreHardwareVinteEUR]),
  "ValoreServiziVinteEUR", SUM('Clienti_Unificati'[ValoreServiziVinteEUR]),
  "CostoHardwareEUR", SUM('Clienti_Unificati'[CostoHardwareEUR]),
  "MargineStimaHardwareEUR", SUM('Clienti_Unificati'[MargineStimaHardwareEUR]),
  "MargineServiziStimaEUR", SUM('Clienti_Unificati'[MargineServiziStimaEUR]),
  "MargineTotaleStima", SUM('Clienti_Unificati'[MargineTotaleStima]),
  "MargineHardwareVinteEUR", SUM('Clienti_Unificati'[MargineHardwareVinteEUR]),
  "MargineServiziVinteEUR", SUM('Clienti_Unificati'[MargineServiziVinteEUR]),
  "MargineTotaleVinteEUR", SUM('Clienti_Unificati'[MargineTotaleVinteEUR])
)`;

const clientsDax = `
EVALUATE
SUMMARIZECOLUMNS(
  'Clienti_Unificati'[Perimetro],
  'Clienti_Unificati'[Cliente],
  "RTSelezionate", SUM('Clienti_Unificati'[RTSelezionate]),
  "StimaHardwareEUR", SUM('Clienti_Unificati'[StimaHardwareEUR]),
  "StimaServiziEUR", SUM('Clienti_Unificati'[StimaServiziEUR])
)`;

const offersSummaryDax = `
EVALUATE
SUMMARIZECOLUMNS(
  'Offerte_Unificate'[StatoOfferta],
  'Offerte_Unificate'[Categoria],
  "ConteggioOfferte", COUNT('Offerte_Unificate'[StatoOfferta]),
  "QuantitaHardware", SUM('Offerte_Unificate'[QuantitaHardware])
)`;

const worklistDax = `
EVALUATE
VAR Worklist =
  SUMMARIZECOLUMNS(
    'Offerte_Unificate'[Cliente],
    'Offerte_Unificate'[StatoOfferta],
    'Offerte_Unificate'[Categoria],
    'Offerte_Unificate'[Agente],
    "GiorniDaCreazione", MAX('Offerte_Unificate'[GiorniDaCreazione]),
    "QuantitaHardware", SUM('Offerte_Unificate'[QuantitaHardware]),
    "ConteggioOfferte", COUNT('Offerte_Unificate'[StatoOfferta])
  )
RETURN TOPN(250, Worklist, [GiorniDaCreazione], DESC)`;

function configured() {
  return Boolean(settings.clientId && settings.datasetId && settings.workspaceId);
}

function getMsal() {
  if (!configured()) throw new Error("Connessione non configurata: inserire Client ID Entra e Semantic Model ID in dist/powerbi-config.js.");
  if (!msalApp) msalApp = new PublicClientApplication({
    auth: { clientId: settings.clientId, authority: settings.authority, redirectUri: settings.redirectUri },
    cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false }
  });
  return msalApp;
}

async function tokenForUser() {
  const app = getMsal();
  await app.initialize();
  const account = app.getActiveAccount() || app.getAllAccounts()[0];
  if (!account) {
    const login = await app.loginPopup({ scopes: settings.scopes });
    app.setActiveAccount(login.account);
    return login.accessToken || (await app.acquireTokenSilent({ account: login.account, scopes: settings.scopes })).accessToken;
  }
  app.setActiveAccount(account);
  try {
    return (await app.acquireTokenSilent({ account, scopes: settings.scopes })).accessToken;
  } catch (error) {
    if (error.name !== "InteractionRequiredAuthError") throw error;
    return (await app.acquireTokenPopup({ account, scopes: settings.scopes })).accessToken;
  }
}

async function executeDax(query, accessToken) {
  const url = `${apiRoot}/groups/${settings.workspaceId}/datasets/${settings.datasetId}/executeQueries`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ queries: [{ query }], serializerSettings: { includeNulls: true } })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || body?.message || `Power BI ha risposto ${response.status}`);
  const result = body?.results?.[0];
  if (result?.error) throw new Error(result.error.message || "Errore nella query DAX");
  return result?.tables?.[0]?.rows || [];
}

function field(row, name) {
  return row?.[`[${name}]`] ?? row?.[`Clienti_Unificati[${name}]`] ?? row?.[`Offerte_Unificate[${name}]`] ?? row?.[name] ?? null;
}
const num = (row, name) => Number(field(row, name) ?? 0) || 0;
const label = (row, name) => String(field(row, name) ?? "").trim();
const sum = (rows, name) => rows.reduce((total, row) => total + num(row, name), 0);
const isExcluded = perimeter => /^(bergamo|gdo)$/i.test(perimeter);
function categoryKey(value) {
  const text = value.toLowerCase();
  if (text.includes("scadut")) return "scadute";
  if (text.includes("21-30") || text.includes("fredda")) return "fredde";
  if (text.includes("11-20") || text.includes("sollecit")) return "sollecito";
  if (text.includes("0-10") || text.includes("calda")) return "calde";
  return "altre";
}
const categoryLabels = { scadute: "SCADUTA", fredde: "FREDDA >20 GG", sollecito: "DA SOLLECITARE", calde: "CALDA <10 GG", altre: "IN CORSO" };
const recommendedAction = { scadute: "Verifica scadenza", fredde: "Ricontatto cliente", sollecito: "Sollecito offerta", calde: "Avanzare ordine", altre: "Verifica stato" };

function shapeDashboard(perimeterRows, clientRows, offerRows, workRows) {
  const perimeters = perimeterRows.filter(row => !isExcluded(label(row, "Perimetro")));
  const clients = clientRows.filter(row => !isExcluded(label(row, "Perimetro")));
  const totals = Object.fromEntries([
    "ClientiTarget", "ClientiVinti", "ClientiConOfferta", "RTCensite", "RTSelezionate", "RTDaVerificare", "Offerte", "OfferteInCorso", "OfferteVinte", "StimaHardwareEUR", "StimaServiziEUR", "ValoreHardwareVinteEUR", "ValoreServiziVinteEUR", "CostoHardwareEUR", "MargineStimaHardwareEUR", "MargineServiziStimaEUR", "MargineTotaleStima", "MargineHardwareVinteEUR", "MargineServiziVinteEUR", "MargineTotaleVinteEUR"
  ].map(key => [key, sum(perimeters, key)]));
  const expectedRevenue = totals.StimaHardwareEUR + totals.StimaServiziEUR;
  const acquiredRevenue = totals.ValoreHardwareVinteEUR + totals.ValoreServiziVinteEUR;
  const acquiredMargin = totals.MargineTotaleVinteEUR;
  const expectedMargin = totals.MargineTotaleStima;
  const ratio = (value, total) => total ? `${(value / total * 100).toFixed(1).replace(".", ",")}% del totale` : "—";
  const economics = [
    { key: "revenue", label: "Ricavo totale acquisito", value: acquiredRevenue, detail: ratio(acquiredRevenue, expectedRevenue), color: "#19365f" },
    { key: "hw", label: "Ricavo HW acquisito", value: totals.ValoreHardwareVinteEUR, detail: ratio(totals.ValoreHardwareVinteEUR, acquiredRevenue), color: "#2774c8" },
    { key: "fee", label: "Servizi acquisiti", value: totals.ValoreServiziVinteEUR, detail: ratio(totals.ValoreServiziVinteEUR, acquiredRevenue), color: "#39a0ec" },
    { key: "cost", label: "Costo HW stimato", value: totals.CostoHardwareEUR, detail: "dal modello Power BI", color: "#f28a27" },
    { key: "hwMargin", label: "Margine HW acquisito", value: totals.MargineHardwareVinteEUR, detail: ratio(totals.MargineHardwareVinteEUR, totals.ValoreHardwareVinteEUR), color: "#2da38f" },
    { key: "feeMargin", label: "Margine servizi", value: totals.MargineServiziVinteEUR, detail: "dal modello Power BI", color: "#7954da" },
    { key: "margin", label: "Margine totale acquisito", value: acquiredMargin, detail: ratio(acquiredMargin, acquiredRevenue), color: "#21836b" }
  ];
  const offerCount = key => sum(offerRows.filter(row => categoryKey(label(row, "Categoria")) === key), "ConteggioOfferte");
  const offerUnits = condition => sum(offerRows.filter(condition), "QuantitaHardware");
  const statusRows = key => offerRows.filter(row => label(row, "StatoOfferta").toLowerCase() === key.toLowerCase());
  const statusCount = key => sum(statusRows(key), "ConteggioOfferte");
  const statusUnits = key => sum(statusRows(key), "QuantitaHardware");
  const clientHot = new Set(workRows.filter(row => categoryKey(label(row, "Categoria")) === "calde").map(row => label(row, "Cliente"))).size;
  const clientLost = new Set(workRows.filter(row => label(row, "StatoOfferta").toLowerCase() === "lost").map(row => label(row, "Cliente"))).size;
  const funnel = [
    { label: "Target", apparati: totals.RTCensite, clienti: totals.ClientiTarget, color: "#19365f" },
    { label: "In progress", apparati: statusUnits("In Progress"), clienti: totals.ClientiConOfferta, color: "#2774c8" },
    { label: "Hot", apparati: offerUnits(row => categoryKey(label(row, "Categoria")) === "calde"), clienti: clientHot, color: "#39a0ec" },
    { label: "Won", apparati: statusUnits("Won"), clienti: totals.ClientiVinti, color: "#f28a27" },
    { label: "Lost", apparati: statusUnits("Lost"), clienti: clientLost, color: "#2da38f" }
  ];
  const pipeline = [
    { label: "In corso", count: statusCount("In Progress"), apparatus: statusUnits("In Progress") },
    { label: "Vinte", count: statusCount("Won"), apparatus: statusUnits("Won") },
    { label: "Perse", count: statusCount("Lost"), apparatus: statusUnits("Lost") }
  ];
  const worklist = workRows.map(row => {
    const key = categoryKey(label(row, "Categoria"));
    return { type: key, category: categoryLabels[key], client: label(row, "Cliente"), apparatus: num(row, "QuantitaHardware"), state: label(row, "StatoOfferta"), days: num(row, "GiorniDaCreazione"), action: recommendedAction[key], owner: label(row, "Agente") || "—" };
  }).filter(row => row.client).sort((a, b) => b.days - a.days);
  const expected = [
    { label: "Ricavo totale", acquired: acquiredRevenue, expected: expectedRevenue },
    { label: "Ricavo HW", acquired: totals.ValoreHardwareVinteEUR, expected: totals.StimaHardwareEUR },
    { label: "Ricavo servizi (Fee)", acquired: totals.ValoreServiziVinteEUR, expected: totals.StimaServiziEUR },
    { label: "Margine HW", acquired: totals.MargineHardwareVinteEUR, expected: totals.MargineStimaHardwareEUR },
    { label: "Margine servizi", acquired: totals.MargineServiziVinteEUR, expected: totals.MargineServiziStimaEUR },
    { label: "Margine totale", acquired: acquiredMargin, expected: expectedMargin }
  ];
  const clientTable = clients.map(row => ({ name: label(row, "Cliente"), count: num(row, "RTSelezionate"), hw: num(row, "StimaHardwareEUR"), fee: num(row, "StimaServiziEUR") })).sort((a, b) => (b.hw + b.fee) - (a.hw + a.fee));
  const contactedClients = new Set(workRows.map(row => label(row, "Cliente")).filter(Boolean)).size;
  const negotiationCount = sum(offerRows.filter(row => /negozia|negotiat/i.test(label(row, "StatoOfferta"))), "ConteggioOfferte");
  const commercialMetrics = [
    { label: "CLIENTI TOTALI", value: totals.ClientiTarget, detail: "" },
    { label: "CONTATTATI", value: contactedClients, detail: ratio(contactedClients, totals.ClientiTarget) },
    { label: "CON OFFERTA", value: totals.ClientiConOfferta, detail: ratio(totals.ClientiConOfferta, totals.ClientiTarget) },
    { label: "NEGOZIAZIONE", value: negotiationCount, detail: ratio(negotiationCount, totals.ClientiTarget) },
    { label: "CONFERMATI", value: totals.ClientiVinti, detail: ratio(totals.ClientiVinti, totals.ClientiTarget) },
    { label: "PERSI", value: clientLost, detail: ratio(clientLost, totals.ClientiTarget) }
  ];
  const commercialDetails = worklist.slice(0, 5).map(row => ({
    client: row.client, owner: row.owner, apparatus: row.apparatus, state: row.state, date: "—", action: row.action
  }));
  return {
    mode: "live",
    filterPerimeters: ["Totale", ...perimeters.map(row => label(row, "Perimetro"))],
    totals: { expectedRevenue, acquiredRevenue, missingRevenue: expectedRevenue - acquiredRevenue, acquiredMargin, missingMargin: expectedMargin - acquiredMargin },
    economics,
    funnel,
    perimeters: perimeters.map((row, index) => ({ name: label(row, "Perimetro"), completed: num(row, "ClientiVinti"), target: num(row, "ClientiTarget"), color: colors[index % colors.length] })),
    perimeterEconomics: perimeters.map(row => ({
      name: label(row, "Perimetro"),
      expectedHardware: num(row, "StimaHardwareEUR"),
      acquiredHardware: num(row, "ValoreHardwareVinteEUR"),
      expectedServices: num(row, "StimaServiziEUR"),
      acquiredServices: num(row, "ValoreServiziVinteEUR"),
      expectedHardwareMargin: num(row, "MargineStimaHardwareEUR"),
      acquiredHardwareMargin: num(row, "MargineHardwareVinteEUR"),
      expectedServicesMargin: num(row, "MargineServiziStimaEUR"),
      acquiredServicesMargin: num(row, "MargineServiziVinteEUR"),
      expectedMargin: num(row, "MargineTotaleStima"),
      acquiredMargin: num(row, "MargineTotaleVinteEUR")
    })),
    wonClients: totals.ClientiVinti,
    commercialMetrics,
    commercialDetails,
    clients: clientTable,
    expected,
    pipeline,
    worklist,
    priorityCounts: { scadute: offerCount("scadute"), fredde: offerCount("fredde"), sollecito: offerCount("sollecito"), calde: offerCount("calde") }
  };
}

async function connectAndLoad() {
  const accessToken = await tokenForUser();
  const results = await Promise.all([
    executeDax(clientSummaryDax, accessToken),
    executeDax(clientsDax, accessToken),
    executeDax(offersSummaryDax, accessToken),
    executeDax(worklistDax, accessToken)
  ]);
  const dashboard = shapeDashboard(...results);
  window.applyPowerBIData(dashboard);
  return dashboard;
}

window.PowerBIConnector = { connectAndLoad };

