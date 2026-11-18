window.POWERBI_CONFIG = {
  clientId: "e1424b25-50e0-4d9f-85a6-5fc369b9054a", // Entra app registration Client ID; public value, no client secret.
  tenantId: "efc254eb-dd92-4b8e-9ef2-7470ce8cee21",
  workspaceId: "fa82781e-0fb4-45b2-98ad-95ac8e000ef5",
  datasetId: "f9511163-464c-4dbf-bcb1-a2236b7a7f9e", // Semantic Model ID, different from the Power BI report ID.
  authority: "https://login.microsoftonline.com/efc254eb-dd92-4b8e-9ef2-7470ce8cee21",
  redirectUri: new URL("redirect.html", window.location.href).href,
  scopes: ["https://analysis.windows.net/powerbi/api/Dataset.Read.All"]
};

