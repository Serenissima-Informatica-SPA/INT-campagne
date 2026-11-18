const demo = {
  mode: "demo",
  filterPerimeters: ["Totale", "Hospitality", "Ristorazione", "Retail Trieste", "The Special Four"],
  totals: { expectedRevenue: 1138000, acquiredRevenue: 385000, missingRevenue: 753000, acquiredMargin: 240000, missingMargin: 510000 },
  economics: [
    { key: "revenue", label: "Ricavo totale", value: 385000, detail: "+€42k settimana", color: "#19365f" },
    { key: "hw", label: "Ricavo HW", value: 265000, detail: "68,8% del totale", color: "#2774c8" },
    { key: "fee", label: "Ricavo servizi (Fee)", value: 120000, detail: "31,2% del totale", color: "#39a0ec" },
    { key: "cost", label: "Costo compl. (HW)", value: 145000, detail: "54,7% del ricavo HW", color: "#f28a27" },
    { key: "hwMargin", label: "Margine HW", value: 120000, detail: "45,3% del ricavo HW", color: "#2da38f" },
    { key: "feeMargin", label: "Margine servizi", value: 120000, detail: "100% del ricavo fee", color: "#7954da" },
    { key: "margin", label: "Margine totale", value: 240000, detail: "62,3% del totale", color: "#21836b" }
  ],
  funnel: [
    { label: "Target", apparati: 1281, clienti: 696, color: "#19365f" },
    { label: "In progress", apparati: 920, clienti: 118, color: "#2774c8" },
    { label: "Hot", apparati: 650, clienti: 71, color: "#39a0ec" },
    { label: "Won", apparati: 510, clienti: 16, color: "#f28a27" },
    { label: "Lost", apparati: 420, clienti: 0, color: "#2da38f" }
  ],
  perimeters: [
    { name: "Ristorazione", completed: 48, target: 68, color: "#2da38f" },
    { name: "Retail Trieste", completed: 126, target: 313, color: "#2774c8" },
    { name: "Hospitality", completed: 246, target: 900, color: "#f28a27" },
    { name: "The Special Four", completed: null, target: null, color: "#39a0ec" }
  ],
  clients: [
    { name: "Cliente dimostrativo A", count: 98, hw: 89000, fee: 40000 },
    { name: "Cliente dimostrativo B", count: 49, hw: 44000, fee: 20000 },
    { name: "Cliente dimostrativo C", count: 31, hw: 28000, fee: 13000 },
    { name: "Cliente dimostrativo D", count: 86, hw: 78000, fee: 35000 },
    { name: "Cliente dimostrativo E", count: 29, hw: 26000, fee: 12000 }
  ],
  expected: [
    { label: "Ricavo totale", acquired: 385000, expected: 1138000 },
    { label: "Ricavo HW", acquired: 265000, expected: 783000 },
    { label: "Ricavo servizi (Fee)", acquired: 120000, expected: 355000 },
    { label: "Margine HW", acquired: 120000, expected: 395000 },
    { label: "Margine servizi", acquired: 120000, expected: 355000 },
    { label: "Margine totale", acquired: 240000, expected: 750000 }
  ],
  pipeline: [
    { label: "Da contattare", count: 35, apparatus: 87 },
    { label: "Contattato", count: 42, apparatus: 126 },
    { label: "Interesse", count: 39, apparatus: 118 },
    { label: "Offerta", count: 55, apparatus: 276 },
    { label: "Negoziazione", count: 48, apparatus: 190 },
    { label: "Confermato", count: 31, apparatus: 157 }
  ],
  worklist: [
    { type: "fredde", category: "FREDDA >20 GG", client: "Cliente dimostrativo A", apparatus: 29, state: "Da contattare", days: 25, action: "Primo contatto", owner: "Commerciale C" },
    { type: "sollecito", category: "DA SOLLECITARE", client: "Cliente dimostrativo B", apparatus: 49, state: "Offerta", days: 19, action: "Sollecito decisione", owner: "Commerciale B" },
    { type: "sollecito", category: "DA SOLLECITARE", client: "Cliente dimostrativo C", apparatus: 31, state: "Negoziazione", days: 15, action: "Revisione offerta", owner: "Commerciale A" },
    { type: "sollecito", category: "DA SOLLECITARE", client: "Cliente dimostrativo D", apparatus: 86, state: "Contattato", days: 12, action: "Demo soluzione", owner: "Commerciale A" },
    { type: "calde", category: "CALDA <10 GG", client: "Cliente dimostrativo E", apparatus: 86, state: "Confermato", days: 4, action: "Ordine fornitore", owner: "Owner commerciale" }
  ],
  priorityCounts: { scadute: 17, fredde: 16, sollecito: 14, calde: 40 }
};

let data = demo;

const state = { page: "panoramica", perimeter: "Totale", funnel: "apparati", search: "", priority: "tutte", showAll: false };
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const money = n => new Intl.NumberFormat("it-IT", { style:"currency", currency:"EUR", maximumFractionDigits:0 }).format(n);
const compact = n => n >= 1_000_000 ? `€${(n/1_000_000).toLocaleString("it-IT",{maximumFractionDigits:2})}M` : `€${(n/1_000).toLocaleString("it-IT",{maximumFractionDigits:0})}k`;
const number = n => new Intl.NumberFormat("it-IT").format(n);

function renderFilters(){
  qs("#perimeter-filters").innerHTML = data.filterPerimeters.map(p=>`<button class="filter-pill ${state.perimeter===p?"active":""}" data-perimeter="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join("");
}
function filteredPerimeters(){return state.perimeter==="Totale"?data.filterPerimeters.slice(1):data.filterPerimeters.slice(1).filter(x=>x===state.perimeter)}
function renderFunnel(){
  const key=state.funnel; const max=Math.max(...data.funnel.map(x=>x[key]));
  qs("#funnel-title").textContent=key==="apparati"?"Funnel apparati":"Funnel clienti";
  qs("#funnel-chart").innerHTML=data.funnel.map(x=>{const val=x[key],width=val?Math.max(30,42+(val/max)*56):30;return `<div class="funnel-step" style="width:${width}%;background:${x.color}">${x.label}<span class="funnel-value">${number(val)}</span></div>`}).join("");
}
function renderPerimeters(){
  const rows=data.perimeters.filter(x=>filteredPerimeters().includes(x.name));
  qs("#perimeter-chart").innerHTML=rows.map(x=>{const value=x.target?x.completed/x.target*100:0;return `<div class="perimeter-row"><span class="perimeter-name">${escapeHtml(x.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(value,0.6)}%;background:${x.color}">${value>=18?`${value.toFixed(1).replace(".",",")}%`:""}</div></div><span class="perimeter-count">${x.target?`${x.completed} / ${x.target}`:"n.d."}</span></div>`}).join("");
  const total=data.economics[1].value+data.economics[2].value; const conv=total?Math.round(data.funnel[3].apparati/data.funnel[0].apparati*1000)/10:0;
  qs("#conversion-value").textContent=`${conv.toLocaleString("it-IT",{minimumFractionDigits:1,maximumFractionDigits:1})}%`;
  qs("#conversion-donut").style.setProperty("--progress",`${conv}%`);
}
function renderClients(){
  const visible=data.clients.filter(x=>x.name.toLowerCase().includes(state.search.toLowerCase()));
  const rows=state.showAll?visible:visible.slice(0,5); qs("#row-count").textContent=`${visible.length} clienti`;
  qs("#client-rows").innerHTML=rows.map(x=>`<tr><td title="${escapeHtml(x.name)}">${escapeHtml(x.name)}</td><td>${x.count}</td><td>${money(x.hw)}</td><td>${money(x.fee)}</td><td>${money(x.hw+x.fee)}</td></tr>`).join("")||`<tr><td colspan="5">Nessun cliente trovato</td></tr>`;
  const total=data.clients.reduce((a,x)=>({count:a.count+x.count,hw:a.hw+x.hw,fee:a.fee+x.fee}),{count:0,hw:0,fee:0});
  qs("#client-total").innerHTML=`<tr><td>${data.mode==="live"?"Totale modello":"Totale demo"}</td><td>${number(total.count)}</td><td>${money(total.hw)}</td><td>${money(total.fee)}</td><td>${money(total.hw+total.fee)}</td></tr>`;
}
function renderKpis(){qs("#kpi-strip").innerHTML=data.economics.map(x=>`<article class="kpi-card" style="--kpi-color:${x.color}"><span class="kpi-label">${x.label.toUpperCase()}</span><strong class="kpi-value">${compact(x.value)}</strong><span class="kpi-detail">${x.detail}</span></article>`).join("")}
function renderExpected(){
  const acquiredPct=data.totals.expectedRevenue?data.totals.acquiredRevenue/data.totals.expectedRevenue*100:0;
  const top=[{label:"Ricavi attesi",value:data.totals.expectedRevenue,detail:"baseline campagna",color:"#19365f"},{label:"Ricavi acquisiti",value:data.totals.acquiredRevenue,detail:`${acquiredPct.toFixed(1).replace(".",",")}% dell’atteso`,color:"#2774c8"},{label:"Ricavi mancanti",value:data.totals.missingRevenue,detail:"da acquisire",color:"#f28a27"},{label:"Margine acquisito",value:data.totals.acquiredMargin,detail:data.mode==="live"?"dal modello Power BI":"stima demo",color:"#2da38f"},{label:"Margine mancante",value:data.totals.missingMargin,detail:"da acquisire",color:"#7954da"}];
  qs("#atteso-metrics").innerHTML=top.map(x=>`<div class="metric-block" style="--accent:${x.color}"><span>${x.label.toUpperCase()}</span><strong>${compact(x.value)}</strong><small>${x.detail}</small></div>`).join("");
  qs("#comparison-chart").innerHTML=`<div class="compare-legend"><span><i class="swatch"></i>Acquisito</span><span><i class="swatch pale"></i>Atteso</span></div>`+data.expected.map(x=>{const p=x.expected?x.acquired/x.expected*100:0;return `<div class="compare-row"><span class="compare-label">${x.label}</span><div class="compare-bars"><div class="compare-track"><div class="compare-fill expected" style="width:100%"></div></div><div class="compare-track"><div class="compare-fill" style="width:${p}%"></div></div></div><span class="compare-values">${p.toFixed(1).replace(".",",")}%</span></div>`}).join("");
  qs("#gap-list").innerHTML=data.expected.map(x=>{const p=x.expected?x.acquired/x.expected*100:0;return `<div class="gap-row"><span>${x.label}</span><strong>${compact(x.expected-x.acquired)}</strong><div class="gap-track"><i style="width:${p}%"></i></div></div>`}).join("");
}
function renderPipeline(){
  const total=data.pipeline.reduce((a,x)=>a+x.count,0),won=data.pipeline.find(x=>x.label==="Vinte")?.count ?? data.pipeline.at(-1).count;
  const stats=data.mode==="live"?[
    {label:"OFFERTE TOTALI",value:total,note:"nel perimetro selezionato"},
    {label:"IN CORSO",value:data.pipeline.find(x=>x.label==="In corso")?.count ?? 0,note:"stato nel modello"},
    {label:"VINTE",value:won,note:"stato nel modello"},
    {label:"PERSE",value:data.pipeline.find(x=>x.label==="Perse")?.count ?? 0,note:"stato nel modello"},
    {label:"CLIENTI VINTI",value:data.wonClients ?? 0,note:"dal modello Power BI"}
  ]:[{label:"CLIENTI TOTALI",value:total,note:"nel perimetro demo"},{label:"CONTATTATI",value:145,note:"66,2% del target"},{label:"CON OFFERTA",value:89,note:"40,6% del target"},{label:"NEGOZIAZIONE",value:48,note:"21,9% del target"},{label:"CONFERMATI",value:won,note:"14,2% del target"}];
  qs("#pipeline-kpis").innerHTML=stats.map(x=>`<div class="small-stat"><span>${x.label}</span><strong>${number(x.value)}</strong><small>${x.note}</small></div>`).join("");
  const max=Math.max(1,...data.pipeline.map(x=>x.count));
  qs("#pipeline-chart").innerHTML=data.pipeline.map(x=>`<div class="pipe-row"><span class="pipe-label">${escapeHtml(x.label)}</span><div class="pipe-track"><div class="pipe-fill" style="width:${Math.max(8,x.count/max*100)}%">${x.count}</div></div><span class="pipe-count">${x.apparatus} app.</span></div>`).join("");
  qs("#pipeline-table").innerHTML=`<div class="mini-row header"><span>CLIENTE</span><span>APP.</span><span>STATO</span><span>AZIONE</span></div>`+data.worklist.slice(0,4).map(x=>`<div class="mini-row"><span>${escapeHtml(x.client)}</span><span>${x.apparatus}</span><span><i class="status ${x.type===`calde`?`green`:x.type===`fredde`?`orange`:x.type===`scadute`?`red`:`blue`}">${escapeHtml(x.state)}</i></span><span>${escapeHtml(x.action)}</span></div>`).join("");
}
function renderPriorities(){
  const stats=[{label:"OFFERTE SCADUTE",value:data.priorityCounts.scadute,note:"intervento immediato",color:"#cf6255"},{label:"OFFERTE FREDDE >20 GG",value:data.priorityCounts.fredde,note:"nessuna attività recente",color:"#e4a348"},{label:"DA SOLLECITARE >10 GG",value:data.priorityCounts.sollecito,note:"richiesto follow-up",color:"#5bacc7"},{label:"OFFERTE CALDE <10 GG",value:data.priorityCounts.calde,note:"opportunità attive",color:"#45a180"}];
  qs("#priority-kpis").innerHTML=stats.map(x=>`<div class="metric-block" style="--accent:${x.color}"><span>${x.label}</span><strong>${x.value}</strong><small>${x.note}</small></div>`).join("");
  const list=data.worklist.filter(x=>state.priority==="tutte"||x.type===state.priority);
  qs("#worklist-rows").innerHTML=list.map(x=>{const color=x.type==="scadute"?"#cf6255":x.type==="fredde"?"#e2a044":x.type==="calde"?"#45a180":"#5bacc7";return `<tr><td><span class="priority-tag" style="--priority:${color}"><i></i>${escapeHtml(x.category)}</span></td><td>${escapeHtml(x.client)}</td><td>${x.apparatus}</td><td><i class="status ${x.type===`calde`?`green`:x.type===`fredde`?`orange`:x.type===`scadute`?`red`:`blue`}">${escapeHtml(x.state)}</i></td><td>${x.days}</td><td>${escapeHtml(x.action)}</td><td>${escapeHtml(x.owner)}</td></tr>`}).join("");
  const rules=[{name:"Scadenza superata",desc:"Offerta scaduta: intervento immediato.",color:"#cf6255"},{name:"Fredda · oltre 20 giorni",desc:"Nessuna attività commerciale recente.",color:"#e4a348"},{name:"Da sollecitare · oltre 10 giorni",desc:"Follow-up richiesto al referente.",color:"#5bacc7"},{name:"Calda · entro 10 giorni",desc:"Offerta attiva con prossima azione ravvicinata.",color:"#45a180"}];
  qs("#priority-rules").innerHTML=rules.map(x=>`<div class="rule" style="--priority:${x.color}"><i></i><div><b>${x.name}</b><span>${x.desc}</span></div></div>`).join("");
}
function goPage(page){
  state.page=page; qsa(".page-view").forEach(x=>x.classList.toggle("active",x.id===`page-${page}`)); qsa(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  const meta={panoramica:["01","Executive overview","La fotografia della campagna: target, conversione e valore."],atteso:["02","Atteso vs acquisito","Confronto tra i valori acquisiti e il target della campagna."],avanzamento:["03","Avanzamento commerciale","Doppia lettura: conversione dei clienti e degli apparati."],priorita:["04","Priorità e attività","Una worklist giornaliera ordinata per urgenza commerciale."]}[page];
  qs("#section-number").textContent=meta[0];qs("#page-title").textContent=meta[1];qs("#page-subtitle").textContent=meta[2];
  window.scrollTo({top:0,behavior:"smooth"});
}
function connectDialog(){qs("#connect-dialog").showModal()}
function showToast(message){const el=qs("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
function renderAll(){renderFilters();renderFunnel();renderPerimeters();renderClients();renderKpis();renderExpected();renderPipeline();renderPriorities()}
window.applyPowerBIData = liveData => {
  data = liveData;
  renderAll();
  qs("#source-label").textContent = "Collegato · Power BI";
  qs("#demo-notice").hidden = true;
  qs(".table-footnote").textContent = "Valori dal modello semantico Power BI";
  qs(".page-foot span:last-child").textContent = `Aggiornato ${new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"short"}).format(new Date())}`;
};
renderAll();
qsa(".nav-item").forEach(b=>b.addEventListener("click",()=>goPage(b.dataset.page)));
qs("#perimeter-filters").addEventListener("click",e=>{const b=e.target.closest("[data-perimeter]");if(!b)return;state.perimeter=b.dataset.perimeter;renderFilters();renderPerimeters();});
qsa(".segment").forEach(b=>b.addEventListener("click",()=>{state.funnel=b.dataset.funnel;qsa(".segment").forEach(x=>x.classList.toggle("active",x===b));renderFunnel()}));
qs("#client-search").addEventListener("input",e=>{state.search=e.target.value;renderClients()});
qs("#table-more").addEventListener("click",()=>{state.showAll=!state.showAll;renderClients();showToast(state.showAll?"Tutti i clienti di esempio":"Vista sintetica")});
qs("#priority-filter").addEventListener("change",e=>{state.priority=e.target.value;renderPriorities()});
qs("#connect-open").addEventListener("click",connectDialog);qs("#notice-connect").addEventListener("click",connectDialog);qs("#model-open").addEventListener("click",()=>qs("#model-dialog").showModal());
qs("#connect-run").addEventListener("click",async()=>{
  const button=qs("#connect-run");
  button.disabled=true; button.textContent="Connessione in corso…";
  try { if (!window.PowerBIConnector) await import("./powerbi.bundle.js"); await window.PowerBIConnector.connectAndLoad(); qs("#connect-dialog").close(); showToast("Dati Power BI aggiornati"); }
  catch(error){ showToast(error.message||"Connessione Power BI non riuscita"); }
  finally { button.disabled=false; button.textContent="Accedi e carica i dati"; }
});
qsa(".dialog-close").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
document.querySelectorAll("dialog").forEach(d=>d.addEventListener("click",e=>{if(e.target===d)d.close()}));


