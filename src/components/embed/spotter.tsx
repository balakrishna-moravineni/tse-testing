import { SpotterEmbed, useEmbedRef } from "@thoughtspot/visual-embed-sdk/react";
import { Action } from "@thoughtspot/visual-embed-sdk";
import { useState } from "react";
import { useAppConfig } from "../../contexts/appConfig";
import { useGlobalModal } from "../GlobalModal";
import { lightThemeStyles } from "./embedUtils";
import { HostEventBar } from "./hostEventBar";

export function MySpotterEmbed() {
  const { showModalContent } = useGlobalModal();
  const { hostEventParams, setFullConfig, worksheetId } = useAppConfig();
  const embedRef = useEmbedRef<typeof SpotterEmbed>();
  const [hideDataModelInstructions, setHideDataModelInstructions] = useState(false);
  const [disableDataModelInstructions, setDisableDataModelInstructions] = useState(false);
  const [disablePreviewDataSpotter, setDisablePreviewDataSpotter] = useState(false);
  const [hidePreviewDataSpotter, setHidePreviewDataSpotter] = useState(false);
  const [isNLInstructionsInSpotterEnabled, setIsNLInstructionsInSpotterEnabled] = useState(true);
  const [updatedSpotterChatPrompt, setUpdatedSpotterChatPrompt] = useState(true);

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

  const spotterToggleButtons = [
    {
      name: hidePreviewDataSpotter ? "Show PreviewData" : "Hide PreviewData",
      callback: () => setHidePreviewDataSpotter(!hidePreviewDataSpotter),
      type: hidePreviewDataSpotter ? "secondary" : "primary",
    },
    {
      name: disablePreviewDataSpotter ? "Enable PreviewData" : "Disable PreviewData",
      callback: () => setDisablePreviewDataSpotter(!disablePreviewDataSpotter),
      type: disablePreviewDataSpotter ? "secondary" : "primary",
    },
    {
      name: hideDataModelInstructions ? "Show DataModelInstructions" : "Hide DataModelInstructions",
      callback: () => setHideDataModelInstructions(!hideDataModelInstructions),
      type: hideDataModelInstructions ? "secondary" : "primary",
    },
    {
      name: disableDataModelInstructions ? "Enable DataModelInstructions" : "Disable DataModelInstructions",
      callback: () => setDisableDataModelInstructions(!disableDataModelInstructions),
      type: disableDataModelInstructions ? "secondary" : "primary",
    },
    {
      name: isNLInstructionsInSpotterEnabled ? "Disable NLInstructions Feature" : "Enable NLInstructions Feature",
      callback: () => setIsNLInstructionsInSpotterEnabled(!isNLInstructionsInSpotterEnabled),
      type: isNLInstructionsInSpotterEnabled ? "primary" : "secondary",
    },
    {
      name: updatedSpotterChatPrompt ? "Old ChatPrompt" : "New ChatPrompt",
      callback: () => setUpdatedSpotterChatPrompt(!updatedSpotterChatPrompt),
      type: updatedSpotterChatPrompt ? "primary" : "secondary",
    },
  ];

  const hiddenActions = [];
  if (hideDataModelInstructions) {
    hiddenActions.push(Action.DataModelInstructions);
  }
  if (hidePreviewDataSpotter) {
    hiddenActions.push(Action.PreviewDataSpotter);
  }
  const disabledActions = [];
  if (disableDataModelInstructions) {
    disabledActions.push(Action.DataModelInstructions);
  }
  if (disablePreviewDataSpotter) {
    disabledActions.push(Action.PreviewDataSpotter);
  }

  return (
    <>
      <HostEventBar embedRef={embedRef} customButtons={spotterToggleButtons} />
      <div className="MyLiveboardOne">
        <SpotterEmbed
          ref={embedRef}
          worksheetId={worksheetId}
          additionalFlags={{
            overrideConsoleLogs: false,
            updatedSpotterChatPrompt: updatedSpotterChatPrompt,
            isNLInstructionsInSpotterEnabled: isNLInstructionsInSpotterEnabled,
          }}
          customizations={lightThemeStyles}
          enablePastConversationsSidebar={true}
          hiddenActions={hiddenActions}
          disabledActions={disabledActions}
          disabledActionReason="This action has been disabled in the embed config"
        />
      </div>
    </>
  );
}

