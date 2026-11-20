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
    { name: "Cliente dimostrativo A", count: 98, hw: 89000, fee: 40000, total: 129000 },
    { name: "Cliente dimostrativo B", count: 49, hw: 44000, fee: 20000, total: 64000 },
    { name: "Cliente dimostrativo C", count: 31, hw: 28000, fee: 13000, total: 41000 },
    { name: "Cliente dimostrativo D", count: 86, hw: 78000, fee: 35000, total: 113000 },
    { name: "Cliente dimostrativo E", count: 29, hw: 26000, fee: 12000, total: 38000 }
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
    { label: "Contattato", count: 32, apparatus: 78 },
    { label: "Interesse", count: 26, apparatus: 66 },
    { label: "Offerta", count: 20, apparatus: 58 },
    { label: "Negoziazione", count: 14, apparatus: 40 },
    { label: "Confermato", count: 10, apparatus: 31 }
  ],
  commercialMetrics: [
    { label: "CLIENTI TOTALI", value: 219, detail: "" },
    { label: "CONTATTATI", value: 145, detail: "66,2%" },
    { label: "CON OFFERTA", value: 89, detail: "40,6%" },
    { label: "NEGOZIAZIONE", value: 48, detail: "21,9%" },
    { label: "CONFERMATI", value: 31, detail: "14,2%" },
    { label: "PERSI", value: 9, detail: "4,1%" }
  ],
  commercialDetails: [
    { client: "Forte Village", owner: "Comm. A", apparatus: 98, state: "Negoziazione", date: "06/11", action: "Revisione offerta" },
    { client: "IHC", owner: "Comm. B", apparatus: 49, state: "Offerta", date: "03/11", action: "Sollecito" },
    { client: "Rocco Forte", owner: "Comm. A", apparatus: 31, state: "Contattato", date: "28/10", action: "Presentazione" },
    { client: "Global Ingross", owner: "M. Primavera", apparatus: 86, state: "Confermato", date: "08/11", action: "Pianificare ordine" },
    { client: "Planetaria", owner: "Comm. C", apparatus: 29, state: "Da contattare", date: "—", action: "Primo contatto" }
  ],
  worklist: [
    { type: "fredde", category: "FREDDA >20 GG", client: "Planetaria", apparatus: 29, state: "Da contattare", days: 25, action: "Primo contatto", owner: "Comm. C" },
    { type: "sollecito", category: "DA SOLLECITARE", client: "IHC", apparatus: 49, state: "Offerta", days: 19, action: "Sollecito decisione", owner: "Comm. B" },
    { type: "sollecito", category: "DA SOLLECITARE", client: "Forte Village", apparatus: 98, state: "Negoziazione", days: 15, action: "Revisione offerta", owner: "Comm. A" },
    { type: "sollecito", category: "DA SOLLECITARE", client: "Rocco Forte", apparatus: 31, state: "Contattato", days: 12, action: "Demo soluzione", owner: "Comm. A" },
    { type: "calde", category: "CALDA <10 GG", client: "Global Ingross", apparatus: 86, state: "Confermato", days: 4, action: "Ordine fornitore", owner: "M. Primavera" }
  ],
  priorityCounts: { scadute: 17, fredde: 16, sollecito: 14, calde: 40 }
};

let data = demo;
let liveSourceData = null;

const state = { page: "panoramica", perimeter: "Totale", overviewPerimeter: "Totale", overviewAxis: null, priorityOwner: "", funnel: "apparati", search: "", priority: "tutte", cross: { category: null, status: null, client: null } };
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => [...root.querySelectorAll(s)];
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const money = n => new Intl.NumberFormat("it-IT", { style:"currency", currency:"EUR", maximumFractionDigits:0 }).format(n);
const compact = n => n === 0 ? "€0" : n < 1000 ? money(n) : n >= 1_000_000 ? `€${(n/1_000_000).toLocaleString("it-IT",{maximumFractionDigits:2})}M` : `€${(n/1_000).toLocaleString("it-IT",{maximumFractionDigits:0})}k`;
const number = n => new Intl.NumberFormat("it-IT").format(n);
const modelPerimeter = value => /^the special four$/i.test(String(value??"").trim())?"T4":String(value??"").trim();
const displayPerimeter = value => /^t4$/i.test(String(value??"").trim())?"The Special Four":String(value??"").trim();
const priorityType = value => {
  const text=String(value||"").toLowerCase();
  if(text.includes("scadut")||text.includes(">30"))return "scadute";
  if(text.includes("21-30")||text.includes("fredda"))return "fredde";
  if(text.includes("11-20")||text.includes("sollecit"))return "sollecito";
  if(text.includes("0-10")||text.includes("calda"))return "calde";
  return "altre";
};

function currentPerimeter(){return state.page==="panoramica"?state.overviewPerimeter:state.perimeter}
function renderFilters(){
  const selected=currentPerimeter();
  qs("#perimeter-filters").innerHTML = data.filterPerimeters.map(p=>`<button class="filter-pill ${selected===p?"active":""}" data-perimeter="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join("");
}
function filteredPerimeters(){const selected=currentPerimeter();return selected==="Totale"?data.filterPerimeters.slice(1):data.filterPerimeters.slice(1).filter(x=>x===selected)}
function renderFunnel(){
  const key=state.funnel; const max=Math.max(...data.funnel.map(x=>x[key]));
  qs("#funnel-title").textContent=key==="apparati"?"Funnel apparati":"Funnel clienti";
  qs("#funnel-chart").innerHTML=data.funnel.map(x=>{const val=x[key],width=val?Math.max(30,42+(val/max)*56):30;const filter=x.label==="Target"?"target":x.label==="Hot"?"category:calde":`status:${x.label==="In progress"?"In Progress":x.label}`;return `<div class="funnel-step" data-funnel-filter="${filter}" role="button" tabindex="0" title="Filtra le altre visualizzazioni" style="cursor:pointer;width:${width}%;background:${x.color}">${x.label}<span class="funnel-value">${number(val)}</span></div>`}).join("");
}
function renderPerimeters(){
  const view=modelPerimeter(state.overviewPerimeter);
  const selectedFunnel=state.funnel==="apparati"?"Apparati":"Clienti";
  const subtitle=qs("#perimeter-subtitle");
  const labelEl=qs(".conversion .eyebrow");
  const isApparati=state.funnel==="apparati";
  subtitle.textContent=isApparati?"Apparati acquisiti sul target":"Clienti acquisiti sul target";
  labelEl.textContent=isApparati?"CONVERSIONE APPARATI":"CONVERSIONE CLIENTI";

  if(data.mode==="live"&&Array.isArray(data.overviewProgress)){
    const rows=data.overviewProgress.filter(row=>
      String(row.funnel||"").trim().toLocaleLowerCase("it-IT")===selectedFunnel.toLocaleLowerCase("it-IT") &&
      String(row.view||"").trim().toLocaleLowerCase("it-IT")===view.toLocaleLowerCase("it-IT")
    );
    qs("#perimeter-chart").innerHTML=rows.map((row,index)=>{
      const pct=Math.max(0,Math.min(100,(Number(row.progress)||0)*100));
      const name=view==="Totale"?displayPerimeter(row.category):row.category;
      const color=["#2da38f","#2774c8","#f28a27","#39a0ec","#7954da"][index%5];
      const active=state.overviewAxis===row.category;
      return `<div class="perimeter-row ${active?"selected":""}" data-overview-axis="${escapeHtml(row.category)}" role="button" tabindex="0" title="Filtra i clienti secondo FiltroClientiDaAsse" style="cursor:pointer"><span class="perimeter-name">${escapeHtml(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct,0.6)}%;background:${color}">${pct>=18?`${pct.toFixed(1).replace(".",",")}%`:""}</div></div><span class="perimeter-count">${pct.toFixed(1).replace(".",",")}%</span></div>`;
    }).join("")||`<div class="empty-state">Nessuna categoria per il filtro selezionato</div>`;
  }else if(data.mode==="demo"&&isApparati){
    qs("#perimeter-chart").innerHTML=`<div class="empty-state">La demo non contiene il dettaglio apparati per perimetro. Collega Power BI per usare la misura Avanzamento dinamico.</div>`;
  }else{
    const rows=data.perimeters.filter(x=>filteredPerimeters().includes(x.name));
    qs("#perimeter-chart").innerHTML=rows.map(x=>{const value=x.target?x.completed/x.target*100:0;return `<div class="perimeter-row"><span class="perimeter-name">${escapeHtml(x.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(value,0.6)}%;background:${x.color}">${value>=18?`${value.toFixed(1).replace(".",",")}%`:""}</div></div><span class="perimeter-count">${x.target?`${x.completed} / ${x.target}`:"n.d."}</span></div>`}).join("");
  }

  let conv=0;
  if(data.mode==="live"&&Array.isArray(data.overviewKpi)){
    const rows=data.overviewKpi.filter(row=>
      String(row.funnel||"").trim().toLocaleLowerCase("it-IT")===selectedFunnel.toLocaleLowerCase("it-IT") &&
      (view==="Totale"||modelPerimeter(row.perimeter).toLocaleLowerCase("it-IT")===view.toLocaleLowerCase("it-IT"))
    );
    const target=rows.reduce((total,row)=>total+(Number(row.target)||0),0);
    const acquired=rows.reduce((total,row)=>total+(Number(row.progress)||0)*(Number(row.target)||0),0);
    conv=target?acquired/target*100:0;
  }else if(data.mode==="demo"){
    const won=Number(data.funnel[3][state.funnel])||0;
    const target=Number(data.funnel[0][state.funnel])||0;
    conv=target?won/target*100:0;
  }
  qs("#conversion-value").textContent=`${conv.toLocaleString("it-IT",{minimumFractionDigits:1,maximumFractionDigits:1})}%`;
  qs("#conversion-donut").style.setProperty("--progress",`${conv}%`);
}
function clientMatchesOverviewAxis(row){
  if(data.mode!=="live"||!state.overviewAxis)return true;
  const view=modelPerimeter(state.overviewPerimeter);
  return (row.axes||[]).some(axis=>{
    const perimeter=modelPerimeter(axis.perimeter);
    return view==="Totale"?perimeter===modelPerimeter(state.overviewAxis):perimeter===view&&String(axis.ap||"").trim().toLocaleLowerCase("it-IT")===String(state.overviewAxis).trim().toLocaleLowerCase("it-IT");
  });
}
function renderClients(){
  const axisRows=data.clients.filter(clientMatchesOverviewAxis);
  const visible=axisRows.filter(x=>x.name.toLowerCase().includes(state.search.toLowerCase()));
  const rows=visible; qs("#row-count").textContent=`${visible.length} clienti`;
  qs("#client-rows").innerHTML=rows.map(x=>`<tr data-cross-kind="client" data-cross-value="${escapeHtml(x.key||x.name)}" title="Seleziona il cliente e filtra le altre visualizzazioni" style="cursor:pointer"><td title="${escapeHtml(x.name)}">${escapeHtml(x.name)}</td><td>${x.count}</td><td>${money(x.hw)}</td><td>${money(x.fee)}</td><td>${money(x.total??(x.hw+x.fee))}</td></tr>`).join("")||`<tr><td colspan="5">Nessun cliente trovato</td></tr>`;
  const total=axisRows.reduce((a,x)=>({count:a.count+x.count,hw:a.hw+x.hw,fee:a.fee+x.fee,total:a.total+(x.total??(x.hw+x.fee))}),{count:0,hw:0,fee:0,total:0});
  qs("#client-total").innerHTML=`<tr><td>${data.mode==="live"?"Totale modello":"Totale demo"}</td><td>${number(total.count)}</td><td>${money(total.hw)}</td><td>${money(total.fee)}</td><td>${money(total.total)}</td></tr>`;
}

function renderKpis(){qs("#kpi-strip").innerHTML=data.economics.map(x=>`<article class="kpi-card" style="--kpi-color:${x.color}"><span class="kpi-label">${x.label.toUpperCase()}</span><strong class="kpi-value">${compact(x.value)}</strong><span class="kpi-detail">${x.detail}</span></article>`).join("")}
const expectedLabels=["Ricavo totale","Ricavo HW","Ricavo Servizi (Fee)","Margine HW","Margine Servizi","Margine totale"];
const euroInThousands = value => `€${Math.round((Number(value)||0)/1000).toLocaleString("it-IT")}k`;
const expectedKpiAmount = value => Number(value)>=1_000_000 ? `€${(Number(value)/1_000_000).toLocaleString("it-IT",{minimumFractionDigits:3,maximumFractionDigits:3})}M` : euroInThousands(value);
function expectedRowsForSelection(){
  if(data.mode==="live") return data.expected.map((row,index)=>({...row,label:expectedLabels[index]||row.label}));
  if(state.perimeter==="Totale") return data.expected.map((row,index)=>({...row,label:expectedLabels[index]||row.label}));
  let source=data.perimeterEconomics||[];
  if(!source.length&&data.mode==="demo"){
    const targetTotal=Math.max(1,data.perimeters.reduce((sum,row)=>sum+(Number(row.target)||0),0));
    const acquiredTotal=Math.max(1,data.perimeters.reduce((sum,row)=>sum+(Number(row.completed)||0),0));
    const split=[
      ["expectedHardware",1,"expected"],["acquiredHardware",1,"acquired"],
      ["expectedServices",2,"expected"],["acquiredServices",2,"acquired"],
      ["expectedHardwareMargin",3,"expected"],["acquiredHardwareMargin",3,"acquired"],
      ["expectedServicesMargin",4,"expected"],["acquiredServicesMargin",4,"acquired"],
      ["expectedMargin",5,"expected"],["acquiredMargin",5,"acquired"]
    ];
    source=data.perimeters.map(perimeter=>{
      const row={name:perimeter.name};
      for(const [key,index,kind] of split){
        const acquired=kind==="acquired";
        const weight=acquired?(Number(perimeter.completed)||0)/acquiredTotal:(Number(perimeter.target)||0)/targetTotal;
        row[key]=Math.round((Number(data.expected[index]?.[kind])||0)*weight);
      }
      return row;
    });
  }
  const selected=source.filter(row=>row.name===state.perimeter);
  if(!selected.length) return data.expected.map((row,index)=>({...row,label:expectedLabels[index]||row.label}));
  const sum=key=>selected.reduce((total,row)=>total+(Number(row[key])||0),0);
  const expectedHardware=sum("expectedHardware"),acquiredHardware=sum("acquiredHardware");
  const expectedServices=sum("expectedServices"),acquiredServices=sum("acquiredServices");
  const missing=(key,acquired,expected)=>data.mode==="live"?sum(key):Math.max(0,expected-acquired);
  const progress=(key,acquired,expected)=>data.mode==="live"&&selected.length===1&&Number.isFinite(Number(selected[0][key]))?Number(selected[0][key]):(expected?acquired/expected*100:0);
  return [
    {label:expectedLabels[0],expected:expectedHardware+expectedServices,acquired:data.mode==="live"?sum("acquiredRevenue"):acquiredHardware+acquiredServices,missing:missing("missingRevenue",acquiredHardware+acquiredServices,expectedHardware+expectedServices),progress:progress("progressRevenue",acquiredHardware+acquiredServices,expectedHardware+expectedServices)},
    {label:expectedLabels[1],expected:expectedHardware,acquired:acquiredHardware,missing:missing("missingHardwareRevenue",acquiredHardware,expectedHardware),progress:progress("progressHardware",acquiredHardware,expectedHardware)},
    {label:expectedLabels[2],expected:expectedServices,acquired:acquiredServices,missing:missing("missingServicesRevenue",acquiredServices,expectedServices),progress:progress("progressServices",acquiredServices,expectedServices)},
    {label:expectedLabels[3],expected:sum("expectedHardwareMargin"),acquired:sum("acquiredHardwareMargin"),missing:missing("missingHardwareMargin",sum("acquiredHardwareMargin"),sum("expectedHardwareMargin")),progress:progress("progressHardwareMargin",sum("acquiredHardwareMargin"),sum("expectedHardwareMargin"))},
    {label:expectedLabels[4],expected:sum("expectedServicesMargin"),acquired:sum("acquiredServicesMargin"),missing:missing("missingServicesMargin",sum("acquiredServicesMargin"),sum("expectedServicesMargin")),progress:progress("progressServicesMargin",sum("acquiredServicesMargin"),sum("expectedServicesMargin"))},
    {label:expectedLabels[5],expected:sum("expectedMargin"),acquired:sum("acquiredMargin"),missing:missing("missingMargin",sum("acquiredMargin"),sum("expectedMargin")),progress:progress("progressMargin",sum("acquiredMargin"),sum("expectedMargin"))}
  ];
}
function renderExpected(){
  const rows=expectedRowsForSelection();
  const revenue=rows[0],margin=rows[5];
  const revenuePct=revenue.progress??(revenue.expected?revenue.acquired/revenue.expected*100:0);
  const marginPct=margin.progress??(margin.expected?margin.acquired/margin.expected*100:0);
  const top=[
    {label:"Ricavi attesi",value:revenue.expected,detail:"baseline campagna",color:"#19365f"},
    {label:"Ricavi acquisiti",value:revenue.acquired,detail:`${revenuePct.toFixed(1).replace(".",",")}% dell’atteso`,color:"#2774c8"},
    {label:"Ricavi mancanti",value:Math.max(0,revenue.missing??(revenue.expected-revenue.acquired)),detail:`${Math.max(0,100-revenuePct).toFixed(1).replace(".",",")}% da acquisire`,color:"#f28a27"},
    {label:"Margine acquisito",value:margin.acquired,detail:`${marginPct.toFixed(1).replace(".",",")}% dell’atteso`,color:"#2da38f"},
    {label:"Margine mancante",value:Math.max(0,margin.missing??(margin.expected-margin.acquired)),detail:`${Math.max(0,100-marginPct).toFixed(1).replace(".",",")}% da acquisire`,color:"#7954da"}
  ];
  qs("#atteso-metrics").innerHTML=top.map(item=>`<div class="metric-block" style="--accent:${item.color}"><span>${item.label.toUpperCase()}</span><strong>${expectedKpiAmount(item.value)}</strong><small>${item.detail}</small></div>`).join("");
  qs("#expected-rows").innerHTML=rows.map((row,index)=>{
    const progress=row.progress??(row.expected?row.acquired/row.expected*100:0);
    const missing=Math.max(0,row.missing??(row.expected-row.acquired));
    const totalClass=index===0||index===rows.length-1?' class="expected-total"':"";
    return `<tr${totalClass}><td>${escapeHtml(row.label)}</td><td>${euroInThousands(row.acquired)}</td><td>${euroInThousands(row.expected)}</td><td>${progress.toFixed(1).replace(".",",")}%</td><td>${missing?euroInThousands(missing):"—"}</td></tr>`;
  }).join("");
  const chartRows=rows.map((row,index)=>{
    const matches=(data.comparison||[]).filter(item=>String(item.label||"").trim().toLocaleLowerCase("it-IT")===String(row.label||"").trim().toLocaleLowerCase("it-IT"));
    const acquiredSeries=matches.find(item=>/acquisito/i.test(item.type||""));
    const expectedSeries=matches.find(item=>/atteso/i.test(item.type||""));
    return {
      label:expectedLabels[index]||row.label,
      acquired:data.mode==="live"&&acquiredSeries?acquiredSeries.value:row.acquired,
      expected:data.mode==="live"&&expectedSeries?expectedSeries.value:row.expected
    };
  });
  const maximum=Math.max(1,...chartRows.flatMap(row=>[Number(row.acquired)||0,Number(row.expected)||0]));
  qs("#expected-chart").innerHTML=`<div class="expected-chart-area">${chartRows.map(row=>{
    const progress=row.expected?row.acquired/row.expected*100:0;
    const acquiredHeight=row.acquired?Math.max(3,(row.acquired/maximum)*86):0;
    const expectedHeight=row.expected?Math.max(3,(row.expected/maximum)*86):0;
    const bar=(value,height,type)=>`<div class="expected-bar-column ${type}" style="--bar-height:${height}%"><span class="expected-bar-value">${euroInThousands(value)}</span><div class="expected-bar">${type==="acquired"&&height>=12?`<span class="expected-bar-percent">${progress.toFixed(1).replace(".",",")}%</span>`:""}</div></div>`;
    return `<div class="expected-chart-group"><div class="expected-chart-bars">${bar(row.acquired,acquiredHeight,"acquired")}${bar(row.expected,expectedHeight,"expected")}</div><span class="expected-chart-label">${escapeHtml(row.label)}</span></div>`;
  }).join("")}</div><div class="expected-chart-legend"><span><i class="expected-swatch acquired"></i>Acquisito</span><span><i class="expected-swatch expected"></i>Atteso campagna</span></div>`;
  qs("#atteso-footer-status").textContent=data.mode==="live"?"Dati dal modello Power BI":"Demo visuale con dati esemplificativi";
  qs("#expected-note").textContent=data.mode==="live"?"Valori dal modello semantico Power BI · Bergamo e GDO esclusi.":"Atteso totale da baseline campagna. Atteso HW/Servizi: stima con la stessa ripartizione dell’acquisito (68,8% / 31,2%). Dati esemplificativi.";
}
function renderPipeline(){
  const metrics=data.commercialMetrics||[];
  const fallback=[
    {label:"CLIENTI TOTALI",value:data.totals?.clientTarget||0,detail:""},
    {label:"CONTATTATI",value:data.pipelineStages?.contacted||0,detail:""},
    {label:"CON OFFERTA",value:data.pipelineStages?.offer||0,detail:""},
    {label:"NEGOZIAZIONE",value:data.pipelineStages?.negotiation||0,detail:""},
    {label:"CONFERMATI",value:data.pipelineStages?.won||0,detail:""},
    {label:"PERSI",value:data.pipelineStages?.lost||0,detail:""}
  ];
  const stats=metrics.length?metrics:fallback;
  qs("#pipeline-kpis").innerHTML=stats.map(item=>`<div class="small-stat"><span>${escapeHtml(item.label)}</span><strong>${number(item.value||0)}</strong><small>${escapeHtml(item.detail||"")}</small></div>`).join("");
  let stages=data.pipeline||[];
  if(data.mode==="live"){
    const normalize=value=>String(value||"").toLowerCase();
    const definitions=[
      ["Da contattare",/da contattare|nuovo|new/],
      ["Contattato",/contattat/],
      ["Interesse",/interess/],
      ["Offerta",/offerta|quote/],
      ["Negoziazione",/negozia/],
      ["Confermato",/confermato|won|vinto/]
    ];
    stages=definitions.map(([label,pattern])=>{
      const matches=(data.worklist||[]).filter(row=>pattern.test(normalize(row.state)));
      return {label,count:new Set(matches.map(row=>row.accountKey||row.client)).size,apparatus:matches.reduce((sum,row)=>sum+(Number(row.apparatus)||0),0)};
    });
  }
  const max=Math.max(1,...stages.flatMap(row=>[Number(row.count)||0,Number(row.apparatus)||0]));
  qs("#pipeline-chart").innerHTML=stages.map(row=>{
    const clientsWidth=Math.max(row.count?2:0,(Number(row.count)||0)/max*100);
    const apparatusWidth=Math.max(row.apparatus?2:0,(Number(row.apparatus)||0)/max*100);
    return `<div class="pipeline-stage" data-cross-kind="status" data-cross-value="${escapeHtml(row.label)}" title="Filtra per stato" style="cursor:pointer"><span class="pipeline-stage-label">${escapeHtml(row.label)}</span><div class="pipeline-stage-bars"><span class="pipeline-stage-bar clients" style="width:${clientsWidth}%"></span><span class="pipeline-stage-bar apparatus" style="width:${apparatusWidth}%"></span></div></div>`;
  }).join("");
  const details=data.commercialDetails||(data.worklist||[]).slice(0,5).map(row=>({client:row.client,owner:row.owner,apparatus:row.apparatus,state:row.state,date:"—",action:row.action}));
  qs("#pipeline-table").innerHTML=`<div class="commercial-row commercial-header"><span>CLIENTE</span><span>OWNER</span><span>APP.</span><span>STATO</span><span>DATA</span><span>PROSSIMA AZIONE</span></div>`+details.slice(0,5).map(row=>`<div class="commercial-row" data-cross-kind="client" data-cross-value="${escapeHtml(row.accountKey||row.client)}" title="Seleziona il cliente e filtra le altre visualizzazioni" style="cursor:pointer"><span>${escapeHtml(row.client)}</span><span>${escapeHtml(row.owner)}</span><span>${number(row.apparatus||0)}</span><span>${escapeHtml(row.state)}</span><span>${escapeHtml(row.date||"—")}</span><span>${escapeHtml(row.action)}</span></div>`).join("");
  const insight=data.mode==="live"?"Dettaglio operativo estratto dalle offerte nel modello semantico.":"Insight: 48 clienti trattati rappresentano 190 apparati: il KPI clienti da solo sottostima il peso delle opportunità.";
  qs("#pipeline-insight").textContent=insight;
  qs("#pipeline-footer-status").textContent=data.mode==="live"?"Dati dal modello Power BI":"Demo visuale con dati esemplificativi";
}
function renderPriorities(){
  const palette={scadute:"#e95757",fredde:"#f3c04b",sollecito:"#32a1f8",calde:"#2ba38f",altre:"#8492a6"};
  const inferredOwners=data.ownerOptions||[...new Set((data.worklist||[]).map(row=>row.owner).filter(Boolean))];
  const owners=[...new Set([...inferredOwners,...(state.priorityOwner?[state.priorityOwner]:[])])].sort((a,b)=>a.localeCompare(b,"it"));
  qs("#owner-filter").innerHTML=`<option value="">Tutti gli owner</option>`+owners.map(owner=>`<option value="${escapeHtml(owner)}">${escapeHtml(owner)}</option>`).join("");
  qs("#owner-filter").value=state.priorityOwner;
  const ownerMatches=owner=>!state.priorityOwner||String(owner||"").trim().toLocaleLowerCase("it-IT")===state.priorityOwner.trim().toLocaleLowerCase("it-IT");
  const details=(data.priorityDetails||[]).filter(row=>String(row.priorityEta||"").trim().toLowerCase()!=="confermata"&&ownerMatches(row.owner));
  const sumEta=pattern=>details.filter(row=>pattern.test(row.priorityEta)).reduce((total,row)=>total+(Number(row.count)||0),0);
  const stats=data.mode==="live"?[
    {key:"scadute",label:"OFFERTE SCADUTE",value:sumEta(/^(creata da >30 giorni|scaduta)$/i),color:palette.scadute},
    {key:"fredde",label:"OFFERTE FREDDE >20 GG",value:sumEta(/^creata da 21-30 giorni$/i),color:palette.fredde},
    {key:"sollecito",label:"OFFERTE DA SOLLECITARE >10 GG",value:sumEta(/^creata da 11-20 giorni$/i),color:palette.sollecito},
    {key:"calde",label:"OFFERTE CALDE <10 GG",value:sumEta(/^creata da 0-10 giorni$/i),color:palette.calde}
  ]:[
    {key:"scadute",label:"OFFERTE SCADUTE",value:data.priorityCounts.scadute,color:palette.scadute},
    {key:"fredde",label:"OFFERTE FREDDE >20 GG",value:data.priorityCounts.fredde,color:palette.fredde},
    {key:"sollecito",label:"OFFERTE DA SOLLECITARE >10 GG",value:data.priorityCounts.sollecito,color:palette.sollecito},
    {key:"calde",label:"OFFERTE CALDE <10 GG",value:data.priorityCounts.calde,color:palette.calde}
  ];
  qs("#priority-kpis").innerHTML=stats.map(item=>`<div class="metric-block" data-cross-kind="category" data-cross-value="${item.key}" title="Filtra per priorità" style="--accent:${item.color};cursor:pointer"><span>${item.label}</span><strong>${number(item.value||0)}</strong><small></small></div>`).join("");
  const distribution=new Map();
  for(const row of details){
    const category=row.category||"Categoria vuota";
    distribution.set(category,(distribution.get(category)||0)+(Number(row.count)||0));
  }
  const categoryOrder=["Scaduta","Fredda >20gg","Da Sollecitare","Calda <10gg","Categoria vuota"];
  let bars=[...distribution.entries()].map(([category,value])=>({category,value,type:priorityType(category)}))
    .sort((a,b)=>{const ai=categoryOrder.findIndex(x=>x.toLowerCase()===a.category.toLowerCase()),bi=categoryOrder.findIndex(x=>x.toLowerCase()===b.category.toLowerCase());return (ai<0?categoryOrder.length:ai)-(bi<0?categoryOrder.length:bi)||a.category.localeCompare(b.category,"it")});
  if(data.mode!=="live") bars=stats.map(item=>({category:item.key==="scadute"?"Scadute":item.key==="fredde"?"Fredde >20 gg":item.key==="sollecito"?"Da sollecitare >10 gg":"Calde <10 gg",value:item.value,type:item.key}));
  const uniqueWorklist=new Map();
  for(const row of (data.worklist||[]).filter(row=>String(row.priorityEta||"").toLowerCase()!=="confermata"&&ownerMatches(row.owner))){
    const key=JSON.stringify([row.category,row.client,row.days,row.owner]);
    if(!uniqueWorklist.has(key))uniqueWorklist.set(key,row);
  }
  const list=[...uniqueWorklist.values()].slice(0,8);
  qs("#worklist-rows").innerHTML=list.map(row=>`<tr data-cross-kind="client" data-cross-value="${escapeHtml(row.accountKey||row.client)}" title="Seleziona il cliente e filtra le altre visualizzazioni" style="cursor:pointer"><td><span class="priority-tag" style="--priority:${palette[row.type]||palette.altre}"><i></i>${escapeHtml(row.category||"—")}</span></td><td>${escapeHtml(row.client)}</td><td>${number(row.days||0)}</td><td>${escapeHtml(row.owner)}</td></tr>`).join("")||`<tr><td colspan="4">Nessuna offerta per i filtri selezionati</td></tr>`;
  const max=Math.max(1,...bars.map(item=>Number(item.value)||0));
  qs("#priority-chart").innerHTML=`<div class="priority-bars">${bars.map(item=>{const height=Math.max(item.value?4:0,(item.value||0)/max*100);return `<div class="priority-bar-group" data-cross-kind="category" data-cross-value="${item.type}" title="Filtra per priorità" style="cursor:pointer"><div class="priority-bar-wrap"><span class="priority-bar-value" style="bottom:calc(${height}% + 6px)">${number(item.value||0)}</span><div class="priority-bar" style="height:${height}%;background:${palette[item.type]||palette.altre}"></div></div><span class="priority-bar-label">${escapeHtml(item.category)}</span></div>`}).join("")}</div>`;
  const overdue=stats.find(item=>item.key==="scadute")?.value||0;
  qs("#priority-alert").textContent=`${number(overdue)} offerte scadute richiedono un intervento immediato`;
  qs("#priority-footer-status").textContent=data.mode==="live"?"Dati dal modello Power BI":"Demo visuale con dati esemplificativi";
  const rules=[{name:"Rosso",desc:"Scadenza superata",color:palette.scadute},{name:"Giallo",desc:">20 giorni fermi",color:palette.fredde},{name:"Celeste",desc:">10 giorni, da sollecitare",color:palette.sollecito},{name:"Verde",desc:"<10 giorni",color:palette.calde}];
  qs("#priority-rules").innerHTML=`<b class="priority-rules-title">Regole semaforo</b>`+rules.map(rule=>`<div class="priority-rule" style="--priority:${rule.color}"><i></i><span><b>${rule.name}</b><small>${rule.desc}</small></span></div>`).join("");
}

function goPage(page){
  state.page=page; document.body.classList.toggle("atteso-mode",page==="atteso"); document.body.classList.toggle("pipeline-mode",page==="avanzamento"); document.body.classList.toggle("priority-mode",page==="priorita"); qs("#demo-notice").hidden=data.mode==="live"||page==="atteso"||page==="avanzamento"||page==="priorita"; qsa(".page-view").forEach(x=>x.classList.toggle("active",x.id===`page-${page}`)); qsa(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  const meta={panoramica:["01","Executive overview","La fotografia della campagna: target, conversione e valore."],atteso:["02","Atteso vs acquisito","Confronto tra i valori economici acquisiti e quelli attesi dalla campagna: quanto è stato fatto e quanto manca all’obiettivo."],avanzamento:["03","Avanzamento commerciale","Doppia lettura: conversione dei clienti e degli apparati."],priorita:["04","Priorità e attività","Una worklist giornaliera ordinata per urgenza commerciale."]}[page];
  qs("#section-number").textContent=meta[0];qs("#page-title").textContent=meta[1];qs("#page-subtitle").textContent=meta[2];
  applyCrossfilters();
  window.scrollTo({top:0,behavior:"smooth"});
}
function connectDialog(){qs("#connect-dialog").showModal()}
function showToast(message){const el=qs("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
function renderAll(){renderFilters();renderFunnel();renderPerimeters();renderClients();renderKpis();renderExpected();renderPipeline();renderPriorities()}
function applyCrossfilters(){
  if(liveSourceData&&window.PowerBIConnector?.filterDashboard){
    data=window.PowerBIConnector.filterDashboard(liveSourceData,{perimeter:state.page==="panoramica"?state.overviewPerimeter:state.perimeter,...state.cross});
    renderAll();
    return;
  }
  const cross=state.cross;
  const matches=(row)=> (!cross.category||row.type===cross.category) && (!cross.status||String(row.state||"").toLowerCase()===cross.status.toLowerCase()) && (!cross.client||row.client===cross.client);
  const worklist=demo.worklist.filter(matches);
  const allowed=new Set(worklist.map(row=>row.client));
  data={...demo,worklist,
    clients:cross.client?demo.clients.filter(row=>row.name===cross.client):cross.category||cross.status?demo.clients.filter(row=>allowed.has(row.name)):demo.clients,
    commercialDetails:demo.commercialDetails.filter(row=>(!cross.client||row.client===cross.client)&&(!cross.status||row.state.toLowerCase()===cross.status.toLowerCase())),
    priorityCounts:cross.category?{scadute:0,fredde:0,sollecito:0,calde:0,[cross.category]:demo.priorityCounts[cross.category]}:demo.priorityCounts
  };
  renderAll();
}
function setCrossFilter(kind,value){state.cross[kind]=state.cross[kind]===value?null:value;applyCrossfilters()}
window.applyPowerBIData = liveData => {
  liveSourceData = liveData;
  data = liveData;
  renderAll();
  qs("#source-label").textContent = "Collegato · Power BI";
  qs("#demo-notice").hidden = true;
  qs(".table-footnote").textContent = "Valori dal modello semantico Power BI";
  qs(".page-foot span:last-child").textContent = `Aggiornato ${new Intl.DateTimeFormat("it-IT",{dateStyle:"short",timeStyle:"short"}).format(new Date())}`;
};
renderAll();
qsa(".nav-item").forEach(b=>b.addEventListener("click",()=>goPage(b.dataset.page)));
qs("#perimeter-filters").addEventListener("click",e=>{const b=e.target.closest("[data-perimeter]");if(!b)return;if(state.page==="panoramica"){state.overviewPerimeter=b.dataset.perimeter;state.overviewAxis=null;}else state.perimeter=b.dataset.perimeter;applyCrossfilters();});
document.addEventListener("click",e=>{
  const axis=e.target.closest("[data-overview-axis]");
  if(axis){state.overviewAxis=state.overviewAxis===axis.dataset.overviewAxis?null:axis.dataset.overviewAxis;renderPerimeters();renderClients();return}
  const cross=e.target.closest("[data-cross-kind]");
  if(cross){setCrossFilter(cross.dataset.crossKind,cross.dataset.crossValue);return}
  const funnel=e.target.closest("[data-funnel-filter]");
  if(funnel){const value=funnel.dataset.funnelFilter;if(value==="target"){state.cross={category:null,status:null,client:null};applyCrossfilters()}else setCrossFilter(value.startsWith("category:")?"category":"status",value.replace(/^category:|^status:/,""))}
});
qsa(".segment").forEach(b=>b.addEventListener("click",()=>{state.funnel=b.dataset.funnel;qsa(".segment").forEach(x=>x.classList.toggle("active",x===b));renderFunnel();renderPerimeters()}));
qs("#client-search").addEventListener("input",e=>{state.search=e.target.value;renderClients()});
qs("#owner-filter").addEventListener("change",e=>{state.priorityOwner=e.target.value;renderPriorities()});

qs("#connect-open").addEventListener("click",connectDialog);qs("#notice-connect").addEventListener("click",connectDialog);qs("#model-open").addEventListener("click",()=>qs("#model-dialog").showModal());
qs("#connect-run").addEventListener("click",async()=>{
  const button=qs("#connect-run"), errorBox=qs("#connect-error");
  errorBox.hidden=true; errorBox.textContent="";
  button.disabled=true; button.textContent="Connessione in corso…";
  try { if (!window.PowerBIConnector) await import("./powerbi.bundle.js?v=executive-overview-funnel-semantic-20261120"); await window.PowerBIConnector.connectAndLoad(); qs("#connect-dialog").close(); showToast("Dati Power BI aggiornati"); }
  catch(error){ errorBox.textContent=error?.message||"Connessione Power BI non riuscita"; errorBox.hidden=false; }
  finally { button.disabled=false; button.textContent="Accedi e carica i dati"; }
});
qsa(".dialog-close").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
document.querySelectorAll("dialog").forEach(d=>d.addEventListener("click",e=>{if(e.target===d)d.close()}));


