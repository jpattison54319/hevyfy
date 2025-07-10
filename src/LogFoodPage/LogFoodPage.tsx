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
    <div style={{
      padding: 0,
      fontFamily: "'Courier New', monospace",
       background: "linear-gradient(135deg, #1a1a1a 0%, #2d2520 100%)",
      border: "4px solid #ff9900",
      borderRadius: "0",
      boxShadow: "0 0 20px rgba(255, 153, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)",
      color: "#f5f5dc",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Retro scan lines effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245, 245, 220, 0.02) 2px, rgba(245, 245, 220, 0.02) 4px)",
        pointerEvents: "none",
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: 20,
          padding: "10px 0",
          border: "2px solid #4a9660",
          backgroundColor: "rgba(74, 150, 96, 0.1)",
          textShadow: "0 0 10px #4a9660"
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "2px",
            color: "#4a9660"
          }}>
            🍎 FOOD LOGGER v2.0 🍎
          </h2>
          <div style={{
            fontSize: "14px",
            color: "#f5f5dc",
            marginTop: 4
          }}>
            [NUTRITIONAL ANALYSIS SYSTEM]
          </div>
        </div>

        {/* Input Section */}
        <div style={{
          marginBottom: 20,
          border: "2px solid #f5f5dc",
          padding: 15,
          backgroundColor: "rgba(245, 245, 220, 0.05)",
        }}>
          <label style={{
            display: "block",
            marginBottom: 8,
            fontSize: "14px",
            color: "#f5f5dc",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            &gt; ENTER FOOD DATA:
          </label>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="DESCRIBE CONSUMED ITEMS..."
            onBlur={() => {
              window.scrollTo(0, window.scrollY);
            }}
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #4a9660",
              borderRadius: "0",
              fontSize: "16px",
              fontFamily: "'Courier New', monospace",
              backgroundColor: "#0a0a0a",
              color: "#f5f5dc",
              resize: "none",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

      {/* Confirmation Screen */}
        {confirming ? (
          <div style={{
            border: "3px solid #ff6600",
            padding: 20,
            backgroundColor: "rgba(255, 102, 0, 0.1)",
            textAlign: "center",
            marginBottom: 20
          }}>
            <div style={{
              fontSize: "18px",
              color: "#ff6600",
              marginBottom: 15,
              textShadow: "0 0 8px #ff6600"
            }}>
              {currencyType === 'bones' ? '🦴' : '🐟' } COST: {Math.round(pendingMeal.calories / 100)} {currencyType}
            </div>
            <div style={{
              fontSize: "14px",
              color: "#ff9900",
              marginBottom: 15
            }}>
              PROCEED WITH TRANSACTION?
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  border: "2px solid #ff9900",
                  backgroundColor: loading ? "#332200" : "#1a1100",
                  color: "#ff9900",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.2s"
                }}
              >
                {loading ? "PROCESSING..." : "✓ CONFIRM"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  border: "2px solid #ff6600",
                  backgroundColor: loading ? "#331100" : "#1a0800",
                  color: "#ff6600",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.2s"
                }}
              >
                ✗ CANCEL
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              style={{
                padding: "15px 30px",
                border: "3px solid #ff9900",
                backgroundColor: loading || !input.trim() ? "#332200" : "#1a1100",
                color: loading || !input.trim() ? "#996600" : "#ff9900",
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: "bold",
                textShadow: loading || !input.trim() ? "none" : "0 0 8px #ff9900",
                transition: "all 0.3s",
                width: "100%"
              }}
            >
              {loading ? "⚡ ANALYZING..." : "🚀 ANALYZE FOOD"}
            </button>
          </div>
        )}

     {/* Error Display */}
        {error && (
          <div style={{
            border: "2px solid #ff3300",
            padding: 15,
            backgroundColor: "rgba(255, 51, 0, 0.1)",
            marginBottom: 20,
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "14px",
              color: "#ff3300",
              textShadow: "0 0 8px #ff3300",
              textTransform: "uppercase"
            }}>
              ⚠️ ERROR: {error}
            </div>
          </div>
        )}

     {response && (
          <div style={{
            border: "3px solid #ff9900",
            padding: 20,
            backgroundColor: "rgba(255, 153, 0, 0.1)",
            textAlign: "center",
            animation: "pulse 2s infinite"
          }}>
            <div style={{
              fontSize: "18px",
              color: "#ff9900",
              textShadow: "0 0 12px #ff9900",
              fontWeight: "bold",
              whiteSpace: "pre-wrap",
              lineHeight: 1.75,
            }}>
              {response}
            </div>
          </div>
        )}
    {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: "12px",
          color: "#f5f5dc",
          opacity: 0.7
        }}>
          POWERED BY XPETS-GPT ENGINE™
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `
      }} />
    </div>
  );
};

export default ChatFoodLogger;
