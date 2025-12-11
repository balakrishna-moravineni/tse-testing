import { SpotterEmbed, useEmbedRef } from "@thoughtspot/visual-embed-sdk/react";
import { useAppConfig } from "../../contexts/appConfig";
import { useGlobalModal } from "../GlobalModal";
import { lightThemeStyles } from "./embedUtils";
import { HostEventBar } from "./hostEventBar";

export function MySpotterEmbed() {
  const { showModalContent } = useGlobalModal();
  const { hostEventParams, setFullConfig, worksheetId } = useAppConfig();
  const embedRef = useEmbedRef<typeof SpotterEmbed>();

  if (!worksheetId) {
    return (
      <div style={{ 
        padding: "40px 20px", 
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h3 style={{ color: "#333", marginBottom: "16px" }}>Worksheet ID Required</h3>
        <p style={{ color: "#555", marginBottom: "8px" }}>
          Please configure a <strong>worksheetId</strong> on the Home page.
        </p>
        <p style={{ color: "#666", marginBottom: "16px" }}>
          Click the <code style={{ 
            background: "#e9ecef", 
            padding: "2px 6px", 
            borderRadius: "4px",
            color: "#495057"
          }}>{`{ }`}</code> button to open the JSON editor and add:
        </p>
        <pre style={{ 
          background: "#fff", 
          color: "#2d3748", 
          padding: "16px 24px", 
          borderRadius: "8px", 
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          fontSize: "14px"
        }}>
          "worksheetId": "your-worksheet-id"
        </pre>
      </div>
    );
  }

  return (
    <>
      <HostEventBar embedRef={embedRef} />
      <div className="MyLiveboardOne">
        <SpotterEmbed
          ref={embedRef}
          worksheetId={worksheetId}
          additionalFlags={{
            overrideConsoleLogs: false,
          }}
          customizations={lightThemeStyles}
          enablePastConversationsSidebar={true}
        />
      </div>
    </>
  );
}

