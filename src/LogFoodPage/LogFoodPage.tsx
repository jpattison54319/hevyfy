import React, { useState } from "react";
import {
  Button,
  Text,
  Panel,
  Spinner,
} from "@salt-ds/core";
import api from "../api/api";
import { useUser } from "../context/UserContext";
import { AxiosError } from "axios";


const ChatFoodLogger = () => {
  const {userData, setUserData} = useUser();
  const currencyType = userData?.pet.currentPet === 'puppy' ? 'bones' : 'fish';
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingMeal, setPendingMeal] = useState<any>(null); // holds meal data until confirmed
const [confirming, setConfirming] = useState(false);        // whether we're in confirmation step

type ValidationErrorResponse = {
  error: string;
  suggestion?: string;
};

const handleSubmit = async () => {
  if (!input.trim()) return;
  setLoading(true);
  setError(null);
  setResponse(null);

  try {
    const { data } = await api.post("/chatnutrition", { message: input });

    const mealWithDescription = {
      ...data,
      description: input,
    };
    console.log(mealWithDescription);
    // Show confirmation with bone cost
    setPendingMeal(mealWithDescription);
    setConfirming(true);

  } catch (error) {
    const axiosError = error as AxiosError;

  const errData = axiosError.response?.data as ValidationErrorResponse;

  if (axiosError.response?.status === 400) {
    setError(errData?.suggestion || "Please describe a specific food item or meal");
  } else {
    setError("Failed to get nutrition info. Try again.");
  }
  } finally {
    setLoading(false);
  }
};

const handleConfirm = async () => {
  if (!pendingMeal) return;

  setLoading(true);
  setError(null);

  try {
    const addMealResponse = await api.post(`/chatnutrition/${userData?.uid}/addMeal`, pendingMeal);
    const { mealAffects, updatedUser } = addMealResponse.data;

    setUserData(updatedUser);

    const summary = [];
    if (mealAffects.currency)
      summary.push(`🦴 This meal cost ${mealAffects.currency} bone${mealAffects.currency > 1 ? 's' : ''}!`);
    if (mealAffects.armorIncrease)
      summary.push(`🛡️ +${mealAffects.armorIncrease.toFixed(1)} Armor from protein`);
    if (mealAffects.defenseIncrease)
      summary.push(`🧱 +${mealAffects.defenseIncrease.toFixed(1)} Defense from fiber`);
    if (mealAffects.speedIncrease)
      summary.push(`💨 +${mealAffects.speedIncrease.toFixed(1)} Speed from hydration`);
    if (mealAffects.intelligenceIncrease)
      summary.push(`🧠 +${mealAffects.intelligenceIncrease} Intelligence from fruits & vegetables`);

    if(summary.length === 0){
      summary.push(`Seems like this meal didnt contain any sustenance!`);

    }
    setResponse(summary.join('\n'));

  } catch (error) {
    setError("Failed to confirm meal. Try again.");
  } finally {
    setLoading(false);
    setPendingMeal(null);
    setConfirming(false);
    setInput(""); // clear text input
  }
};

const handleCancel = () => {
  setPendingMeal(null);
  setConfirming(false);
  setResponse(null);
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
          onBlur={() => {
  // iOS Safari-specific hack to reflow and possibly nudge zoom out
  window.scrollTo(0, window.scrollY);
}}
          rows={5}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid var(--salt-palette-neutral-300)",
            fontSize: "17px",
            fontFamily: "inherit",
            backgroundColor: "var(--salt-container-primary-background)",
            color: "var(--salt-content-primary-foreground)",
            resize: "vertical",
          }}
        />

      {confirming ? (
  <>
    <Text styleAs="h2">
      🦴 This meal will cost {Math.round(pendingMeal.calories / 100)} {currencyType}. Proceed?
    </Text>
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <Button onClick={handleConfirm} sentiment="positive" disabled={loading}>
        {loading ? <Spinner size="small" /> : "Confirm"}
      </Button>
      <Button onClick={handleCancel} sentiment="neutral" disabled={loading}>
        Cancel
      </Button>
    </div>
  </>
) : (
  <Button
    appearance="solid"
    sentiment="accented"
    onClick={handleSubmit}
    disabled={loading || !input.trim()}
    style={{ marginTop: 12 }}
  >
    {loading ? <Spinner size="small" /> : "Send"}
  </Button>
)}

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
          <Text style={{lineHeight: '33px'}} styleAs="h3"> {response}</Text>
        </pre>
      )}
    </Panel>
  );
};

export default ChatFoodLogger;
