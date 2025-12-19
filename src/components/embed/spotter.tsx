import {
  SpotterEmbed,
  useEmbedRef,
  EmbedEvent,
  HostEvent,
} from "@thoughtspot/visual-embed-sdk/react";
import { useEffect } from "react";
import { RJSFSchema } from "@rjsf/utils";
import { useAppConfig } from "../../contexts/appConfig";
import { useGlobalModal } from "../GlobalModal";
import { lightThemeStyles, getParamFromModal } from "./embedUtils";
import { HostEventBar } from "./hostEventBar";

// Schema for AddToCoaching host event
const getAddToCoachingSchema = (parameters: Record<string, any> = {}): RJSFSchema => {
  const AddToCoaching = "addToCoaching";
  return {
    title: "AddToCoaching Params",
    type: "object" as const,
    required: ["vizId"],
    properties: {
      vizId: {
        type: "string" as const,
        title: "Viz ID",
        default: parameters[AddToCoaching]?.vizId || "",
      },
    },
  };
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#4263eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  transition: "background-color 0.2s",
};

export function MySpotterEmbed() {
  const { showModalContent, closeModal } = useGlobalModal();
  const { hostEventParams, setFullConfig, worksheetId } = useAppConfig();
  const embedRef = useEmbedRef<typeof SpotterEmbed>();

  const handleAddToCoachingWithVizId = async () => {
    const schema = getAddToCoachingSchema(hostEventParams);
    const [params, error] = await getParamFromModal(schema, showModalContent, closeModal);
    if (error) return;

    setFullConfig({
      hostEventParams: {
        ...hostEventParams,
        addToCoaching: params,
      },
    });

    console.log("[HostEvent.AddToCoaching] Triggering with:", params);
    await embedRef?.current?.trigger(HostEvent.AddToCoaching, params);
  };

  const handleDataModelInstructions = () => {
    embedRef?.current
      ?.trigger(HostEvent.DataModelInstructions)
      .then((res) => {
        console.info("HostEvent DataModelInstructions Response:", res);
      })
      .catch((err) => {
        console.error("HostEvent DataModelInstructions Error:", err);
      });
  };

  const handlePreviewSpotterData = () => {
    embedRef?.current
      ?.trigger(HostEvent.PreviewSpotterData)
      .then((res) => {
        console.info("HostEvent PreviewSpotterData Response:", res);
      })
      .catch((err) => {
        console.error("HostEvent PreviewSpotterData Error:", err);
      });
  };

  const handleAddToCoaching = () => {
    embedRef?.current
      ?.trigger(HostEvent.AddToCoaching)
      .then((res) => {
        console.info("HostEvent AddToCoaching Response:", res);
      })
      .catch((err) => {
        console.error("HostEvent AddToCoaching Error:", err);
      });
  };

  // Listen to Spotter embed events
  useEffect(() => {
    if (embedRef.current) {
      embedRef.current.on(EmbedEvent.DataModelInstructions, (payload) => {
        console.log("=== EmbedEvent.DataModelInstructions ===");
        console.log("Payload:", payload);
        console.log("========================================");
      });

      embedRef.current.on(EmbedEvent.PreviewSpotterData, (payload) => {
        console.log("=== EmbedEvent.PreviewSpotterData ===");
        console.log("Payload:", payload);
        console.log("=====================================");
      });

      embedRef.current.on(EmbedEvent.AddToCoaching, (payload) => {
        console.log("=== EmbedEvent.AddToCoaching ===");
        console.log("Payload:", payload);
        console.log("=====================================");
      });
    }
  }, [embedRef]);

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
      <div style={{ 
        padding: "12px 16px", 
        backgroundColor: "#f8f9fa", 
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <span style={{ color: "#555", fontSize: "14px" }}>Spotter Host Events:</span>
        <button
          style={buttonStyle}
          onClick={handleDataModelInstructions}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3b5bdb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4263eb")}
        >
          Data Model Instructions
        </button>
        <button
          style={buttonStyle}
          onClick={handlePreviewSpotterData}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3b5bdb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4263eb")}
        >
          Preview Spotter Data
        </button>
        <button
          style={buttonStyle}
          onClick={handleAddToCoaching}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3b5bdb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4263eb")}
        >
          Add To Coaching
        </button>
        <button
          style={buttonStyle}
          onClick={handleAddToCoachingWithVizId}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3b5bdb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4263eb")}
        >
          AddToCoaching with vizId
        </button>
      </div>
      <div className="MyLiveboardOne">
        <SpotterEmbed
          ref={embedRef}
          worksheetId={worksheetId}
          additionalFlags={{
            overrideConsoleLogs: false,
            updatedSpotterChatPrompt: true,
            enableSpotterWorksheetTablePreview: true,
          }}
          customizations={lightThemeStyles}
          enablePastConversationsSidebar={true}
        />
      </div>
    </>
  );
}

