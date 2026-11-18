window.POWERBI_CONFIG = {
  clientId: "", // Entra app registration Client ID; public value, no client secret.
  tenantId: "03dd21be-dcc3-4c1c-adae-2c776ad78ab2",
  workspaceId: "fa82781e-0fb4-45b2-98ad-95ac8e000ef5",
  datasetId: "", // Semantic Model ID, different from the Power BI report ID.
  authority: "https://login.microsoftonline.com/03dd21be-dcc3-4c1c-adae-2c776ad78ab2",
  redirectUri: window.location.origin + window.location.pathname,
  scopes: ["https://analysis.windows.net/powerbi/api/Dataset.Read.All"]
};

