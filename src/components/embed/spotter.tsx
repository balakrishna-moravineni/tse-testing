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
      answerId: {
        type: "string" as const,
        title: "Answer ID",
        default: parameters[AddToCoaching]?.answerId || "",
      },
    },
  };
};

export function MySpotterEmbed() {
  const { showModalContent } = useGlobalModal();
  const { hostEventParams, setFullConfig, worksheetId } = useAppConfig();
  const embedRef = useEmbedRef<typeof SpotterEmbed>();

  // Listen for AddToCoaching embed event and log the payload
  useEffect(() => {
    const embedInstance = embedRef.current;
    if (embedInstance?.on) {
      embedInstance.on(EmbedEvent.AddToCoaching, (payload) => {
        console.log("[EmbedEvent.AddToCoaching] Payload:", payload);
        showModalContent(
          JSON.stringify({ event: "AddToCoaching", payload }, null, 2)
        );
      });
    }
  }, [embedRef, showModalContent]);

  // Custom button for triggering AddToCoaching host event
  const addToCoachingButton = {
    name: "AddToCoaching",
    callback: async () => {
      const schema = getAddToCoachingSchema(hostEventParams);
      const [params, error] = await getParamFromModal(schema, showModalContent);
      if (error) return;

      setFullConfig({
        hostEventParams: {
          ...hostEventParams,
          addToCoaching: params,
        },
      });

      console.log("[HostEvent.AddToCoaching] Triggering with:", params);
      const res = await embedRef.current.trigger(HostEvent.AddToCoaching, params);

      showModalContent(
        JSON.stringify(
          { event: "AddToCoaching Response", response: res },
          null,
          2
        )
      );
    },
    type: "primary",
  };

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
      <HostEventBar embedRef={embedRef} customButtons={[addToCoachingButton]} />
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

