import React, { useState } from "react";
import { Bone } from "./Bone";
import { Fish } from "./Fish";
import { getPetArchetype } from "../home/HomePage";

interface CurrencyRowProps {
  count: number;
  consumedCurrency: boolean[];
  userArchetype: string;
}

export const CalorieCurrencyContainer: React.FC<CurrencyRowProps> = ({ count, consumedCurrency, userArchetype}) => {
    const bonesLeft = count - consumedCurrency.filter(Boolean).length;
  
 return (
     <div style={{ width: "100%" }}>
        <div
        style={{
          textAlign: "center",
          marginTop: 6,
          fontSize: 14,
          color: "#ccc"
        }}
      >
        {bonesLeft} / {count}{" "}
        {userArchetype === "puppy" ? "bones left" : "fish left"}
      </div>
      {/* Icon Row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          width: "100%",
          overflow: "hidden",
           minHeight: 0,
        }}
      >
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            style={{
              //flex: `1 0 ${100 / count}%`,
              // maxWidth: `${100 / count}%`,
               width: 32, 
        height: 32,
              display: "flex",
              justifyContent: "center"
            }}
          >
            {userArchetype === "canine" ? (
              <Bone consumed={consumedCurrency[i] ?? false} />
            ) : (
              <Fish consumed={consumedCurrency[i] ?? false} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};