# Campagna RT 2027

Dashboard operativa con la gerarchia visiva del PowerPoint e dati interrogati dal semantic model Power BI.

## Pagine

- Executive overview: funnel, avanzamento per perimetro, clienti e indicatori economici.
- Atteso vs acquisito: ricavi e margini previsti e acquisiti.
- Avanzamento commerciale: offerte per stato e dettaglio per cliente.
- Priorità e attività: offerte raggruppate per stato, categoria e anzianità.

La grafica segue il PowerPoint. Le query usano il semantic model `Campagna RT2027 Unificata` e non riutilizzano i visual Power BI.

## Collegamento Power BI

Il frontend usa MSAL Browser con OAuth Authorization Code + PKCE e richiede un token Microsoft dell’utente. Con quel token esegue query DAX sull’API Power BI `datasets/{datasetId}/executeQueries`; non ci sono password, client secret o dati estratti nel repository.

Prima di attivare i dati live:

1. Il Client ID Entra, il Tenant ID, il Semantic Model ID e il Workspace ID sono già impostati in `dist/powerbi-config.js`.
2. Nell’app Entra, registrare come Redirect URI SPA `https://serenissima-informatica-spa.github.io/INT-campagne/redirect.html`.
3. Aggiungere all’app Entra il permesso delegato Power BI `Dataset.Read.All` e ottenere il consenso richiesto dall’organizzazione.
4. Abilitare nel tenant Power BI l’impostazione `Dataset Execute Queries REST API`; chi accede deve avere permesso Read e Build sul semantic model.
5. Dopo il deploy, aprire la dashboard e premere **Accedi e carica i dati**. Ogni utente accede con il proprio account Microsoft.

L’app interroga `Clienti_Unificati` per perimetri, clienti, target e valori economici; interroga `Offerte_Unificate` per stato, categoria, quantità e worklist. Il modello collega entrambe le tabelle a `Clienti_Unificati`. La pagina Executive usa `ValoreVinteEUR`, `ValoreHardwareVinteEUR`, `ValoreServiziVinteEUR`, `CostoHardwareEUR` e le misure margine vinte. Atteso vs acquisito usa le stime HW/servizi, `ValoreVinteEUR`, `MargineTotaleVinteEUR` e le misure `MancRic*` e `MancMarg*` per gli importi mancanti.

Le selezioni di perimetro, cliente, stato pipeline e categoria priorità si propagano alle altre visualizzazioni; cliccare di nuovo la selezione la rimuove. La tabella `Matricole_Unificate` è presente e collegata a `Clienti_Unificati`, ma non viene interrogata direttamente dai visual attuali: i conteggi RT e le quantità provengono dagli aggregati di clienti e offerte.

Nel modello corrente non risultano la tabella `Misura dinamica` né le misure `Atteso_tab`, `Acquisito_tab`, `Avanzamento_tab` e `Mancante_tab` indicate nel documento. L’app riproduce le sei righe della matrice con i campi e le misure attualmente disponibili. Il documento indica anche `CostoHardwareVinteEUR`, che non compare nel modello; per il KPI costo l’app mantiene `CostoHardwareEUR`, il campo disponibile in `Clienti_Unificati`. Da verificare quando lo schema sarà completato.
I valori mostrati prima dell’accesso sono soltanto dimostrativi; dopo il login l’app usa le query live del semantic model.

La query restituisce soltanto i campi necessari alle visualizzazioni. La worklist ordina al massimo 250 gruppi di offerte per anzianità. Le azioni suggerite sono regole dell’interfaccia derivate da `Categoria`, non una colonna esistente nel modello. L’app legge lo stato attualmente pubblicato nel semantic model; la sua frequenza di aggiornamento resta quella configurata in Power BI.

## GitHub Pages

Il workflow `.github/workflows/pages.yml` compila il connettore MSAL e pubblica la cartella `dist` tramite GitHub Actions a ogni push su `main`. La repo può restare privata; la pagina GitHub Pages è pubblicamente raggiungibile, ma la dashboard richiede comunque autenticazione Microsoft e autorizzazioni sul modello.

## Sviluppo locale

```bash
npm install
npm run build
```

Aprire `dist/index.html` per visualizzare l’anteprima. Per la connessione live usare GitHub Pages o un server HTTPS con il relativo Redirect URI registrato.

