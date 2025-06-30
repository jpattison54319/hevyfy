import React, { useState } from "react";
import {
  Button,
  Text,
  Panel,
  Spinner,
} from "@salt-ds/core";
import api from "../api/api";

const ChatFoodLogger = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {

     const { data } = await api.post('/chatnutrition', { message: input });


      setResponse(JSON.stringify(data, null, 2));
    } catch {
      setError("Failed to get nutrition info. Try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <Panel style={{ maxWidth: 480, margin: "auto", padding: 16 }}>
      <Text styleAs="h2" style={{ marginBottom: 12 }}>
        Log Your Food
      </Text>

       <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you ate today..."
          rows={5}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid var(--salt-palette-neutral-300)",
            fontSize: "1rem",
            fontFamily: "inherit",
            backgroundColor: "var(--salt-container-primary-background)",
            color: "var(--salt-content-primary-foreground)",
            resize: "vertical",
          }}
        />

      <Button
        appearance="solid"
        sentiment="accented"
        onClick={handleSubmit}
        disabled={loading || !input.trim()}
        style={{ marginTop: 12 }}
      >
        {loading ? <Spinner size="small" /> : "Send"}
      </Button>

      {error && (
        <Text
          styleAs="display2"
          style={{ color: "var(--salt-error-text-color)", marginTop: 12 }}
        >
          {error}
        </Text>
      )}

      {response && (
        <pre
          style={{
            marginTop: 16,
            backgroundColor: "var(--salt-gray-50)",
            padding: 12,
            borderRadius: 6,
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: 14,
          }}
        >
          {response}
        </pre>
      )}
    </Panel>
  );
};

export default ChatFoodLogger;
