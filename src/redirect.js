import { broadcastResponseToMainFrame } from "@azure/msal-browser/redirect-bridge";

broadcastResponseToMainFrame().catch(error => {
  console.error("MSAL redirect bridge error:", error);
});
