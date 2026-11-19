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

L’app interroga `Clienti_Unificati` per perimetri, clienti, target e valori economici; interroga `Offerte_Unificate` per stato, categoria, quantità e worklist. Il PBIP aggiornato conferma le relazioni tra offerte/matricole e clienti e tra clienti e target. La Executive overview usa il funnel con conteggi apparati/clienti derivati da `Clienti_Unificati` e `Offerte_Unificate`; la tabella cliente usa `Cliente`, `RTSelezionate`, `ValoreHardwareEUR`, `ValoreServiziEUR` e `ValoreOfferteEUR`, come nel visual PBIP. Il filtro per perimetro è isolato a questa pagina. Il PBIP attuale non contiene le tabelle/parametri `funnel`, `asseAP`, `overview_perimetro` né la misura `FiltroClientiDaAsse`; il controllo apparati/clienti e le categorie sono quindi riprodotti nell’interfaccia, mentre la tabella esclude righe prive di valori. Per rendere identico il filtro DAX `FiltroClientiDaAsse = 1` serve che la misura sia presente nel semantic model. Atteso vs acquisito usa le misure `AttesoRicavo*`, `AttesoMargine*`, `MancRic*` e `MancMarg*`; la matrice e il grafico leggono `MisuraDinamica[Voce]`, `MisuraDinamica[Tipo]`, `Acquisito_tab`, `Atteso_tab`, `Avanzamento_tab`, `Mancante_tab` e `Confronto`.

Le selezioni di perimetro, cliente, stato pipeline e categoria priorità si propagano alle altre visualizzazioni; cliccare di nuovo la selezione la rimuove. La tabella `Matricole_Unificate` è presente e collegata a `Clienti_Unificati`, ma non viene interrogata direttamente dai visual attuali: i conteggi RT e le quantità provengono dagli aggregati di clienti e offerte.

Il PBIP aggiornato conferma che `MisuraDinamica`, le misure dinamiche e `CostoHardwareVinteEUR` sono presenti. Il connettore interroga queste misure insieme ai dati cliente, perimetro e offerta; le selezioni di cliente mantengono la chiave account del modello e ricalcolano le visualizzazioni live.
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

