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

1. In `dist/powerbi-config.js`, valorizzare `clientId` con il Client ID di un’app Microsoft Entra registrata come Single-page application e `datasetId` con il Semantic Model ID pubblicato. Il `workspaceId` è già impostato sul workspace del report.
2. Registrare come Redirect URI SPA l’URL GitHub Pages della repo, ad esempio `https://serenissima-informatica-spa.github.io/INT-campagne/redirect.html`.
3. Aggiungere all’app Entra il permesso delegato Power BI `Dataset.Read.All` e ottenere il consenso richiesto dall’organizzazione.
4. Abilitare nel tenant Power BI l’impostazione `Dataset Execute Queries REST API`; chi accede deve avere permesso Read e Build sul semantic model.
5. Dopo il deploy, aprire la dashboard e premere **Accedi e carica i dati**. Ogni utente accede con il proprio account Microsoft.

Il report ID nell’URL non è il Semantic Model ID. L’ID del modello e il Client ID Entra non sono ancora inseriti. I valori dell’anteprima locale sono dimostrativi; non vengono pubblicati come dati live.

La query restituisce soltanto i campi necessari alle visualizzazioni. La worklist ordina al massimo 250 gruppi di offerte per anzianità. Le azioni suggerite sono regole dell’interfaccia derivate da `Categoria`, non una colonna esistente nel modello. L’app legge lo stato attualmente pubblicato nel semantic model; la sua frequenza di aggiornamento resta quella configurata in Power BI.

## GitHub Pages

Il workflow `.github/workflows/pages.yml` compila il connettore MSAL e pubblica la cartella `dist` tramite GitHub Actions a ogni push su `main`. La repo può restare privata; la pagina GitHub Pages è pubblicamente raggiungibile, ma la dashboard richiede comunque autenticazione Microsoft e autorizzazioni sul modello.

## Sviluppo locale

```bash
npm install
npm run build
```

Aprire `dist/index.html` per visualizzare l’anteprima. Per la connessione live usare GitHub Pages o un server HTTPS con il relativo Redirect URI registrato.

