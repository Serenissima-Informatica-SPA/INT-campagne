window.POWERBI_CONFIG = {
  clientId: "e1424b25-50e0-4d9f-85a6-5fc369b9054a", // Entra app registration Client ID; public value, no client secret.
  tenantId: "03dd21be-dcc3-4c1c-adae-2c776ad78ab2",
  workspaceId: "fa82781e-0fb4-45b2-98ad-95ac8e000ef5",
  datasetId: "f9511163-464c-4dbf-bcb1-a2236b7a7f9e", // Semantic Model ID, different from the Power BI report ID.
  authority: "https://login.microsoftonline.com/03dd21be-dcc3-4c1c-adae-2c776ad78ab2",
  redirectUri: window.location.origin + window.location.pathname,
  scopes: ["https://analysis.windows.net/powerbi/api/Dataset.Read.All"]
};

