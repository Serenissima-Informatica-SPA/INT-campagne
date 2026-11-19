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
  "AttesoPezzi", [AttesoPezzi],
  "AttesoRicavoTotale", [AttesoRicavoTotale],
  "AttesoRicavoHW", [AttesoRicavoHW],
  "AttesoServizi", [AttesoServizi],
  "AttesoMargineHW", [AttesoMargineHW],
  "AttesoMargineServizi", [AttesoMargineServizi],
  "AttesoMargineTotale", [AttesoMargineTotale],
  "ValoreVinteEUR", [ValoreVinte],
  "ValoreHardwareVinteEUR", [ValoreHardwareVinte],
  "ValoreServiziVinteEUR", [ValoreServiziVinte],
  "CostoHardwareVinteEUR", [CostoHardwareVinteEUR],
  "CostoHardwareColonnaEUR", SUM('Clienti_Unificati'[CostoHardwareEUR]),
  "MargineHardwareVinteEUR", [MargineHardwareVinte],
  "MargineServiziVinteEUR", [MargineServiziVinte],
  "MargineTotaleVinteEUR", [MargineTotaleVinte],
  "MancRicTotale", [MancRicTotale],
  "MancRicHW", [MancRicHW],
  "MancRicServizi", [MancRicServizi],
  "MancMargHW", [MancMargHW],
  "MancMargServizi", [MancMargServizi],
  "MancMargTotale", [MancMargTotale],
  "AvanzRicTotale", [AvanzRicTotale],
  "AvanzRicHW", [AvanzRicHW],
  "AvanzRicServizi", [AvanzRicServizi],
  "AvanzMargHW", [AvanzMargHW],
  "AvanzMargServizi", [AvanzMargServizi],
  "AvanzMargTotale", [AvanzMargTotale]
)`;

const clientsDax = `
EVALUATE
SUMMARIZECOLUMNS(
  'Clienti_Unificati'[Perimetro],
  'Clienti_Unificati'[AP],
  'Clienti_Unificati'[ChiaveAccount],
  'Clienti_Unificati'[Cliente],
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
  "N.RT", [N.RT],
  "HW", [HW],
  "Fee", [Fee],
  "Totale", [Totale],
  "ValoreVinteEUR", [ValoreVinte],
  "ValoreHardwareVinteEUR", [ValoreHardwareVinte],
  "ValoreServiziVinteEUR", [ValoreServiziVinte],
  "CostoHardwareVinteEUR", [CostoHardwareVinteEUR],
  "CostoHardwareColonnaEUR", SUM('Clienti_Unificati'[CostoHardwareEUR]),
  "MargineHardwareVinteEUR", [MargineHardwareVinte],
  "MargineServiziVinteEUR", [MargineServiziVinte],
  "MargineTotaleVinteEUR", [MargineTotaleVinte]
)`;

const offersSummaryDax = `
EVALUATE
SUMMARIZECOLUMNS(
  'Clienti_Unificati'[Perimetro],
  'Offerte_Unificate'[ChiaveAccount],
  'Offerte_Unificate'[Cliente],
  'Offerte_Unificate'[StatoOfferta],
  'Offerte_Unificate'[Categoria],
  'Offerte_Unificate'[PrioritaEta],
  'Offerte_Unificate'[Agente],
  "ConteggioOfferte", COUNT('Offerte_Unificate'[StatoOfferta]),
  "ConteggioPriorita", COUNT('Offerte_Unificate'[PrioritaEta]),
  "HotCount", SUM('Offerte_Unificate'[Fino10]),
  "QuantitaHardware", SUM('Offerte_Unificate'[QuantitaHardware])
)`;

const worklistDax = `
EVALUATE
VAR Worklist =
  SUMMARIZECOLUMNS(
    'Clienti_Unificati'[Perimetro],
    'Offerte_Unificate'[ChiaveAccount],
    'Offerte_Unificate'[Cliente],
    'Offerte_Unificate'[StatoOfferta],
    'Offerte_Unificate'[Categoria],
    'Offerte_Unificate'[PrioritaEta],
    'Offerte_Unificate'[Agente],
    "GiorniDaCreazione", MAX('Offerte_Unificate'[GiorniDaCreazione]),
    "QuantitaHardware", SUM('Offerte_Unificate'[QuantitaHardware]),
    "ConteggioOfferte", COUNT('Offerte_Unificate'[StatoOfferta])
  )
RETURN TOPN(250, Worklist, [GiorniDaCreazione], DESC)`;

const expectedRowsDax = `
EVALUATE
SUMMARIZECOLUMNS(
  'Clienti_Unificati'[Perimetro],
  'Clienti_Unificati'[ChiaveAccount],
  'MisuraDinamica'[ID],
  'MisuraDinamica'[Voce],
  "Acquisito", [Acquisito_tab],
  "Atteso", [Atteso_tab],
  "Avanzamento", [Avanzamento_tab],
  "Mancante", [Mancante_tab]
)`;

const comparisonDax = `
EVALUATE
SUMMARIZECOLUMNS(
  'Clienti_Unificati'[Perimetro],
  'Clienti_Unificati'[ChiaveAccount],
  'MisuraDinamica'[IDgr],
  'MisuraDinamica'[Voce],
  'MisuraDinamica'[Tipo],
  "Confronto", [Confronto]
)`;

const overviewProgressDax = `
EVALUATE
VAR ProgressRows =
  SUMMARIZECOLUMNS(
    'Overview_Perimetro'[Perimetro],
    'AsseAP'[Categoria],
    "AvanzamentoDinamico", [Avanzamento dinamico]
  )
RETURN FILTER(ProgressRows, NOT ISBLANK([AvanzamentoDinamico]))`;

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
  return row?.[`[${name}]`] ?? row?.[`Clienti_Unificati[${name}]`] ?? row?.[`Offerte_Unificate[${name}]`] ?? row?.[`MisuraDinamica[${name}]`] ?? row?.[`Target[${name}]`] ?? row?.[`Misure[${name}]`] ?? row?.[`AsseAP[${name}]`] ?? row?.[`Overview_Perimetro[${name}]`] ?? row?.[`Funnel[${name}]`] ?? row?.[name] ?? null;
}
const num = (row, name) => Number(field(row, name) ?? 0) || 0;
const label = (row, name) => String(field(row, name) ?? "").trim();
const sum = (rows, name) => rows.reduce((total, row) => total + num(row, name), 0);
const isExcluded = perimeter => /^(bergamo|gdo)$/i.test(perimeter);
const modelPerimeter = value => /^the special four$/i.test(String(value ?? "").trim()) ? "T4" : String(value ?? "").trim();
const displayPerimeter = value => /^t4$/i.test(String(value ?? "").trim()) ? "The Special Four" : String(value ?? "").trim();
const accountKey = row => label(row, "ChiaveAccount") || label(row, "Cliente");
function categoryKey(value) {
  const text = value.toLowerCase();
  if (text.includes("scadut") || text.includes(">30")) return "scadute";
  if (text.includes("21-30") || text.includes("fredda")) return "fredde";
  if (text.includes("11-20") || text.includes("sollecit")) return "sollecito";
  if (text.includes("0-10") || text.includes("calda")) return "calde";
  return "altre";
}
const categoryLabels = { scadute: "SCADUTA", fredde: "FREDDA >20 GG", sollecito: "DA SOLLECITARE", calde: "CALDA <10 GG", altre: "IN CORSO" };
const recommendedAction = { scadute: "Verifica scadenza", fredde: "Ricontatto cliente", sollecito: "Sollecito offerta", calde: "Avanzare ordine", altre: "Verifica stato" };
const sameOverviewView = (a, b) => String(a ?? "").trim().toLocaleLowerCase("it-IT") === String(b ?? "").trim().toLocaleLowerCase("it-IT");

function overviewProgressFromClients(rows) {
  const groups = new Map();
  const add = (view, category, row) => {
    if (!view || !category) return;
    const key = `${view}|${category}`;
    if (!groups.has(key)) groups.set(key, { view, category, won: 0, target: 0 });
    const group = groups.get(key);
    group.won += num(row, "ClientiVinti");
    group.target += num(row, "ClientiTarget");
  };
  for (const row of rows) {
    const perimeter = label(row, "Perimetro");
    if (!perimeter || isExcluded(perimeter)) continue;
    add("Totale", perimeter, row);
    add(perimeter, label(row, "AP"), row);
  }
  return [...groups.values()].map(row => ({ view: row.view, category: row.category, progress: row.target ? row.won / row.target : 0 }));
}

function buildPriorityDistribution(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (row.priorityEta.trim().toLowerCase() === "confermata") continue;
    const category = row.category || "Categoria vuota";
    groups.set(category, (groups.get(category) || 0) + row.count);
  }
  const order = ["Scaduta", "Fredda >20gg", "Da Sollecitare", "Calda <10gg", "Categoria vuota"];
  return [...groups.entries()]
    .map(([category, count]) => ({ category, count, type: categoryKey(category) }))
    .sort((a, b) => {
      const ai = order.findIndex(value => value.toLowerCase() === a.category.toLowerCase());
      const bi = order.findIndex(value => value.toLowerCase() === b.category.toLowerCase());
      return (ai < 0 ? order.length : ai) - (bi < 0 ? order.length : bi) || a.category.localeCompare(b.category, "it");
    });
}

function aggregateDynamicRows(matrixRows, comparisonRows) {
  const byPerimeter = new Map();
  for (const row of matrixRows.filter(row => !isExcluded(label(row, "Perimetro")))) {
    const perimeter = label(row, "Perimetro");
    const id = num(row, "ID");
    const key = `${perimeter}|${id}`;
    if (!byPerimeter.has(key)) byPerimeter.set(key, { perimeter, id, label: label(row, "Voce"), expected: num(row, "Atteso"), acquired: 0 });
    byPerimeter.get(key).acquired += num(row, "Acquisito");
  }
  const totals = new Map();
  for (const item of byPerimeter.values()) {
    if (!totals.has(item.id)) totals.set(item.id, { id: item.id, label: item.label, expected: 0, acquired: 0 });
    const total = totals.get(item.id);
    total.expected += item.expected;
    total.acquired += item.acquired;
  }
  const expected = [...totals.values()].sort((a, b) => a.id - b.id).map(row => ({
    label: row.label,
    acquired: row.acquired,
    expected: row.expected,
    missing: row.expected - row.acquired,
    progress: row.expected ? row.acquired / row.expected * 100 : 0
  }));

  const byPerimeterSeries = new Map();
  for (const row of comparisonRows.filter(row => !isExcluded(label(row, "Perimetro")))) {
    const perimeter = label(row, "Perimetro");
    const labelValue = label(row, "Voce");
    const type = label(row, "Tipo");
    const key = `${perimeter}|${labelValue}|${type}`;
    if (!byPerimeterSeries.has(key)) byPerimeterSeries.set(key, { perimeter, label: labelValue, type, value: 0, first: true });
    const bucket = byPerimeterSeries.get(key);
    const value = num(row, "Confronto");
    if (/atteso/i.test(type)) {
      if (bucket.first) bucket.value = value;
      bucket.first = false;
    } else {
      bucket.value += value;
    }
  }
  const series = new Map();
  for (const item of byPerimeterSeries.values()) {
    const key = `${item.label}|${item.type}`;
    if (!series.has(key)) series.set(key, { label: item.label, type: item.type, value: 0 });
    series.get(key).value += item.value;
  }
  return { expected, comparison: [...series.values()] };
}

function shapeDashboard(perimeterRows, clientRows, offerRows, workRows, dynamicRows = [], comparisonRows = [], overviewRows = []) {
  const perimeters = perimeterRows.filter(row => !isExcluded(label(row, "Perimetro")));
  const clients = clientRows.filter(row => !isExcluded(label(row, "Perimetro")));
  const totals = Object.fromEntries([
    "ClientiTarget", "ClientiVinti", "ClientiConOfferta", "RTCensite", "RTSelezionate", "RTDaVerificare", "Offerte", "OfferteInCorso", "OfferteVinte", "AttesoPezzi",
    "AttesoRicavoTotale", "AttesoRicavoHW", "AttesoServizi", "AttesoMargineHW", "AttesoMargineServizi", "AttesoMargineTotale",
    "ValoreVinteEUR", "ValoreHardwareVinteEUR", "ValoreServiziVinteEUR", "CostoHardwareVinteEUR", "CostoHardwareColonnaEUR", "MargineHardwareVinteEUR", "MargineServiziVinteEUR", "MargineTotaleVinteEUR",
    "MancRicTotale", "MancRicHW", "MancRicServizi", "MancMargHW", "MancMargServizi", "MancMargTotale"
  ].map(key => [key, sum(perimeters, key)]));
  const expectedSummary = aggregateDynamicRows(dynamicRows, comparisonRows);
  const expectedRevenue = totals.AttesoRicavoTotale;
  const acquiredRevenue = totals.ValoreVinteEUR;
  const missingRevenue = totals.MancRicTotale;
  const acquiredMargin = totals.MargineTotaleVinteEUR;
  const expectedMargin = totals.AttesoMargineTotale;
  const missingMargin = totals.MancMargTotale;
  const ratio = (value, total) => total ? `${(value / total * 100).toFixed(1).replace(".", ",")}% del totale` : "—";
  const economics = [
    { key: "revenue", label: "Ricavo totale acquisito", value: acquiredRevenue, detail: ratio(acquiredRevenue, expectedRevenue), color: "#19365f" },
    { key: "hw", label: "Ricavo HW acquisito", value: totals.ValoreHardwareVinteEUR, detail: ratio(totals.ValoreHardwareVinteEUR, acquiredRevenue), color: "#2774c8" },
    { key: "fee", label: "Servizi acquisiti", value: totals.ValoreServiziVinteEUR, detail: ratio(totals.ValoreServiziVinteEUR, acquiredRevenue), color: "#39a0ec" },
    { key: "cost", label: "Costo HW stimato", value: totals.CostoHardwareVinteEUR, detail: totals.CostoHardwareVinteEUR > 0 ? ratio(totals.CostoHardwareVinteEUR, totals.ValoreHardwareVinteEUR) : totals.CostoHardwareColonnaEUR > 0 ? "Costi presenti, nessuno sulle vinte" : "Nessun costo valorizzato nel modello", color: "#f28a27" },
    { key: "hwMargin", label: "Margine HW acquisito", value: totals.MargineHardwareVinteEUR, detail: ratio(totals.MargineHardwareVinteEUR, totals.ValoreHardwareVinteEUR), color: "#2da38f" },
    { key: "feeMargin", label: "Margine servizi", value: totals.MargineServiziVinteEUR, detail: "dal modello Power BI", color: "#7954da" },
    { key: "margin", label: "Margine totale acquisito", value: acquiredMargin, detail: ratio(acquiredMargin, acquiredRevenue), color: "#21836b" }
  ];
  const offerUnits = condition => sum(offerRows.filter(condition), "QuantitaHardware");
  const statusRows = key => offerRows.filter(row => label(row, "StatoOfferta").toLowerCase() === key.toLowerCase());
  const statusCount = key => sum(statusRows(key), "ConteggioOfferte");
  const statusUnits = key => sum(statusRows(key), "QuantitaHardware");
  const hotOffers = offerRows.filter(row => /^creata da 0-10 giorni$/i.test(label(row, "PrioritaEta")));
  const funnel = [
    { label: "Target", apparati: totals.AttesoPezzi, clienti: totals.ClientiTarget, color: "#19365f" },
    { label: "In progress", apparati: statusUnits("In Progress"), clienti: statusCount("In Progress"), color: "#2774c8" },
    { label: "Hot", apparati: sum(hotOffers, "QuantitaHardware"), clienti: sum(offerRows, "HotCount"), color: "#39a0ec" },
    { label: "Won", apparati: statusUnits("Won"), clienti: statusCount("Won"), color: "#f28a27" },
    { label: "Lost", apparati: statusUnits("Lost"), clienti: statusCount("Lost"), color: "#2da38f" }
  ];
  const priorityEtaMatchers = {
    scadute: /^(creata da >30 giorni|scaduta)$/i,
    fredde: /^creata da 21-30 giorni$/i,
    sollecito: /^creata da 11-20 giorni$/i,
    calde: /^creata da 0-10 giorni$/i
  };
  const priorityCounts = Object.fromEntries(Object.entries(priorityEtaMatchers).map(([key, matcher]) => [
    key, sum(offerRows.filter(row => matcher.test(label(row, "PrioritaEta"))), "ConteggioPriorita")
  ]));
  const priorityDetails = offerRows.map(row => ({
    priorityEta: label(row, "PrioritaEta"),
    category: label(row, "Categoria"),
    owner: label(row, "Agente"),
    count: num(row, "ConteggioPriorita")
  }));
  const ownerOptions = [...new Set(priorityDetails.map(row => row.owner).filter(Boolean))].sort((a, b) => a.localeCompare(b, "it"));
  const overviewProgress = overviewRows.length
    ? overviewRows.map(row => ({ view: label(row, "Perimetro"), category: label(row, "Categoria"), progress: num(row, "AvanzamentoDinamico") }))
        .filter(row => row.category && !(sameOverviewView(row.view, "Totale") && isExcluded(row.category)))
    : overviewProgressFromClients(clients);
  const pipeline = [
    { label: "In corso", count: statusCount("In Progress"), apparatus: statusUnits("In Progress") },
    { label: "Vinte", count: statusCount("Won"), apparatus: statusUnits("Won") },
    { label: "Perse", count: statusCount("Lost"), apparatus: statusUnits("Lost") }
  ];
  const worklist = workRows.map(row => {
    const key = categoryKey(label(row, "PrioritaEta") || label(row, "Categoria"));
    return { type: key, category: label(row, "Categoria"), priorityEta: label(row, "PrioritaEta"), accountKey: accountKey(row), client: label(row, "Cliente"), apparatus: num(row, "QuantitaHardware"), state: label(row, "StatoOfferta"), days: num(row, "GiorniDaCreazione"), action: recommendedAction[key], owner: label(row, "Agente") || "—" };
  }).filter(row => row.client).sort((a, b) => b.days - a.days);
  const expected = expectedSummary.expected;
  const clientTableMap = new Map();
  for (const row of clients) {
    const name = label(row, "Cliente");
    if (!name) continue;
    if (!clientTableMap.has(name)) clientTableMap.set(name, { key: "", keys: new Set(), name, count: 0, hw: 0, fee: 0, total: 0, axes: [] });
    const target = clientTableMap.get(name);
    const key = accountKey(row);
    if (key) target.keys.add(key);
    target.count += num(row, "N.RT");
    target.hw += num(row, "HW");
    target.fee += num(row, "Fee");
    target.total += num(row, "Totale");
    const axis = { perimeter: label(row, "Perimetro"), ap: label(row, "AP") };
    if (!target.axes.some(item => item.perimeter === axis.perimeter && item.ap === axis.ap)) target.axes.push(axis);
  }
  const clientTable = [...clientTableMap.values()].map(row => ({ ...row, key: row.keys.size === 1 ? [...row.keys][0] : "" }))
    .filter(row => row.count > 0 || row.hw > 0 || row.fee > 0 || row.total > 0)
    .sort((a, b) => b.total - a.total);
  const contactedClients = new Set(workRows.map(accountKey).filter(Boolean)).size;
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
    accountKey: row.accountKey, client: row.client, owner: row.owner, apparatus: row.apparatus, state: row.state, date: "—", action: row.action
  }));
  return {
    mode: "live",
    filterPerimeters: ["Totale", ...perimeters.map(row => displayPerimeter(label(row, "Perimetro")))],
    totals: { expectedRevenue, acquiredRevenue, missingRevenue, acquiredMargin, missingMargin },
    economics,
    funnel,
    perimeters: perimeters.map((row, index) => ({ name: displayPerimeter(label(row, "Perimetro")), completed: num(row, "ClientiVinti"), target: num(row, "ClientiTarget"), color: colors[index % colors.length] })),
    perimeterEconomics: perimeters.map(row => ({
      name: displayPerimeter(label(row, "Perimetro")),
      expectedHardware: num(row, "AttesoRicavoHW"),
      acquiredHardware: num(row, "ValoreHardwareVinteEUR"),
      expectedServices: num(row, "AttesoServizi"),
      acquiredServices: num(row, "ValoreServiziVinteEUR"),
      acquiredRevenue: num(row, "ValoreVinteEUR"),
      expectedHardwareMargin: num(row, "AttesoMargineHW"),
      acquiredHardwareMargin: num(row, "MargineHardwareVinteEUR"),
      expectedServicesMargin: num(row, "AttesoMargineServizi"),
      acquiredServicesMargin: num(row, "MargineServiziVinteEUR"),
      expectedMargin: num(row, "AttesoMargineTotale"),
      acquiredMargin: num(row, "MargineTotaleVinteEUR"),
      missingRevenue: num(row, "MancRicTotale"),
      missingHardwareRevenue: num(row, "MancRicHW"),
      missingServicesRevenue: num(row, "MancRicServizi"),
      missingHardwareMargin: num(row, "MancMargHW"),
      missingServicesMargin: num(row, "MancMargServizi"),
      missingMargin: num(row, "MancMargTotale")
    })),
    wonClients: totals.ClientiVinti,
    commercialMetrics,
    commercialDetails,
    clients: clientTable,
    expected,
    comparison: expectedSummary.comparison,
    pipeline,
    worklist,
    priorityCounts,
    priorityDetails,
    priorityDistribution: buildPriorityDistribution(priorityDetails),
    ownerOptions,
    overviewProgress,
    raw: { perimeters: perimeterRows, clients: clientRows, offers: offerRows, work: workRows, dynamic: dynamicRows, comparison: comparisonRows, overview: overviewRows }
  };
}

const clientMetricFields = ["ClientiTarget", "ClientiVinti", "ClientiConOfferta", "RTCensite", "RTSelezionate", "N.RT", "HW", "Fee", "Totale", "HW", "Fee", "Totale", "RTDaVerificare", "Offerte", "OfferteInCorso", "OfferteVinte", "StimaHardwareEUR", "StimaServiziEUR", "ValoreVinteEUR", "ValoreHardwareVinteEUR", "ValoreServiziVinteEUR", "CostoHardwareVinteEUR", "CostoHardwareColonnaEUR", "MargineHardwareVinteEUR", "MargineServiziVinteEUR", "MargineTotaleVinteEUR"];
const targetFields = ["AttesoPezzi", "AttesoRicavoTotale", "AttesoRicavoHW", "AttesoServizi", "AttesoMargineHW", "AttesoMargineServizi", "AttesoMargineTotale"];

function filterDashboard(base, selection = {}) {
  if (!base?.raw) return base;
  const same = (a, b) => String(a ?? "").trim().toLocaleLowerCase("it-IT") === String(b ?? "").trim().toLocaleLowerCase("it-IT");
  const perimeterSelected = !selection.perimeter || selection.perimeter === "Totale" ? null : modelPerimeter(selection.perimeter);
  const inPerimeter = row => !perimeterSelected || same(label(row, "Perimetro"), perimeterSelected);
  let clients = base.raw.clients.filter(inPerimeter);
  let offers = base.raw.offers.filter(inPerimeter);
  let work = base.raw.work.filter(inPerimeter);
  if (selection.category) {
    offers = offers.filter(row => categoryKey(label(row, "Categoria")) === selection.category);
    work = work.filter(row => categoryKey(label(row, "Categoria")) === selection.category);
  }
  if (selection.status) {
    const stages = [
      ["Da contattare", /da contattare|nuovo|new/i],
      ["Contattato", /contattat/i],
      ["Interesse", /interess/i],
      ["Offerta", /offerta|quote/i],
      ["Negoziazione", /negozia/i],
      ["Confermato", /confermato|won|vinto/i],
      ["Persi", /pers[oa]|lost/i]
    ];
    const stage = stages.find(([name]) => same(name, selection.status));
    const matchesStatus = row => stage ? stage[1].test(label(row, "StatoOfferta")) : same(label(row, "StatoOfferta"), selection.status);
    offers = offers.filter(matchesStatus);
    work = work.filter(matchesStatus);
  }
  const eligibleKeys = new Set([...offers, ...work].map(accountKey).filter(Boolean));
  if (selection.client) {
    clients = clients.filter(row => same(accountKey(row), selection.client) || same(label(row, "Cliente"), selection.client));
    offers = offers.filter(row => same(accountKey(row), selection.client) || same(label(row, "Cliente"), selection.client));
    work = work.filter(row => same(accountKey(row), selection.client) || same(label(row, "Cliente"), selection.client));
  } else if (selection.category || selection.status) {
    clients = clients.filter(row => eligibleKeys.has(accountKey(row)));
  }
  const perimetersInSelection = new Set(clients.map(row => label(row, "Perimetro")).filter(Boolean));
  const sourceSummaries = base.raw.perimeters.filter(row => perimetersInSelection.has(label(row, "Perimetro")) && !isExcluded(label(row, "Perimetro")));
  const clientMap = new Map();
  for (const row of clients) {
    const perimeter = label(row, "Perimetro");
    if (!perimeter) continue;
    if (!clientMap.has(perimeter)) clientMap.set(perimeter, { "Clienti_Unificati[Perimetro]": perimeter });
    const target = clientMap.get(perimeter);
    for (const key of clientMetricFields) target[`[${key}]`] = (Number(target[`[${key}]`] || 0) + num(row, key));
  }
  const summaryMap = new Map(sourceSummaries.map(row => [label(row, "Perimetro"), row]));
  const perimeterRows = [...clientMap.entries()].map(([perimeter, clientTotals]) => {
    const summary = summaryMap.get(perimeter) || {};
    const merged = { ...clientTotals };
    for (const key of targetFields) merged[`[${key}]`] = num(summary, key);
    merged["[MancRicTotale]"] = num(merged, "AttesoRicavoTotale") - num(merged, "ValoreVinteEUR");
    merged["[MancRicHW]"] = num(merged, "AttesoRicavoHW") - num(merged, "ValoreHardwareVinteEUR");
    merged["[MancRicServizi]"] = num(merged, "AttesoServizi") - num(merged, "ValoreServiziVinteEUR");
    merged["[MancMargHW]"] = num(merged, "AttesoMargineHW") - num(merged, "MargineHardwareVinteEUR");
    merged["[MancMargServizi]"] = num(merged, "AttesoMargineServizi") - num(merged, "MargineServiziVinteEUR");
    merged["[MancMargTotale]"] = num(merged, "AttesoMargineTotale") - num(merged, "MargineTotaleVinteEUR");
    return merged;
  });
  const selectedKeys = new Set(clients.map(accountKey));
  const dynamic = base.raw.dynamic.filter(row => {
    const p = label(row, "Perimetro");
    return !isExcluded(p) && perimetersInSelection.has(p) && selectedKeys.has(accountKey(row));
  });
  const comparison = base.raw.comparison.filter(row => {
    const p = label(row, "Perimetro");
    return !isExcluded(p) && perimetersInSelection.has(p) && selectedKeys.has(accountKey(row));
  });
  return shapeDashboard(perimeterRows, clients, offers, work, dynamic, comparison, []);
}

async function connectAndLoad() {
  const accessToken = await tokenForUser();
  const results = await Promise.all([
    executeDax(clientSummaryDax, accessToken),
    executeDax(clientsDax, accessToken),
    executeDax(offersSummaryDax, accessToken),
    executeDax(worklistDax, accessToken),
    executeDax(expectedRowsDax, accessToken),
    executeDax(comparisonDax, accessToken),
    executeDax(overviewProgressDax, accessToken)
  ]);
  const dashboard = shapeDashboard(...results);
  window.applyPowerBIData(dashboard);
  return dashboard;
}

window.PowerBIConnector = { connectAndLoad, filterDashboard };

