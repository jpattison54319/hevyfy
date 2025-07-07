import { Card, Text } from "@salt-ds/core";
import { useState } from "react";
import Emoji from "../Emoji/Emoji";

const RPE_CARDS = {
  puppy: [
    { rpe: 1, emoji: "🐾", text: "Sniffed around the park" },
    { rpe: 2, emoji: "🐕", text: "Chased tail" },
    { rpe: 3, emoji: "🐺", text: "Chased squirrel" },
    { rpe: 4, emoji: "🔥🐺", text: "Life or death fight with a bear" },
  ],
  kitten: [
    { rpe: 1, emoji: "💤", text: "Big stretch under a tree" },
    { rpe: 2, emoji: "🐱", text: "Thunder? Nope, Midnight zoomies" },
    { rpe: 3, emoji: "🐯", text: "Climbed the tallest tree in the realm" },
    { rpe: 4, emoji: "🔥🐯", text: "Celestial lion battle in the astral jungle" },
  ],
};

export type PetType = "puppy" | "kitten";

const RpeSelector = ({
  petType,
  onChange,
}: {
  petType: PetType;
  onChange?: (rpe: number) => void;
}) => {
  const cards = RPE_CARDS[petType];
  const [selectedRpe, setSelectedRpe] = useState<number | null>(null);

    const handleClick = (rpe: number) => {
    setSelectedRpe(rpe);
    if (onChange) onChange(rpe); 
  };

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: 'center' }}>
      {cards.map((card) => (
        <Card
          key={card.rpe}
          onClick={() => handleClick(card.rpe)}
          style={{
            cursor: "pointer",
            border:
              selectedRpe === card.rpe ? "2px solid #ffa640" : "1px solid #ccc",
            background: selectedRpe === card.rpe ? "#222" : "#1d1d1d",
            width: 140,
            textAlign: "center",
            padding: 8,
          }}
        >
          <Emoji size={32} symbol={card.emoji} />
          <Text style={{ fontSize: 12, marginTop: 8 }}>{card.rpe}</Text>
          <Text style={{ fontSize: 14, marginTop: 6 }}>{card.text}</Text>
        </Card>
      ))}
    </div>
  );
};

export default RpeSelector;