import React, { useState } from "react";
import { Bone } from "./Bone";

interface BonesRowProps {
  count: number;
  consumedCurrency: boolean[];
}

export const CalorieCurrencyContainer: React.FC<BonesRowProps> = ({ count, consumedCurrency}) => {

 return (
    <div style={{    display: "flex",
        flexWrap: "wrap", // allow wrapping if bones exceed width
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        width: "100%",
        overflow: "hidden",}}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
           style={{
            flex: `1 0 ${100 / count}%`, // make each bone take a fraction of space
            maxWidth: `${100 / count}%`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Bone consumed={consumedCurrency[i] ?? false} />
        </div>
      ))}
    </div>
  );
};