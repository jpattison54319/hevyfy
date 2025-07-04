import { FlexLayout, FlexItem, Card, Text } from "@salt-ds/core";
import styles from "./SkillsPage.module.scss"; // Assuming you have a CSS module for styles
import { useUser } from "../context/UserContext";
import Emoji from "../Emoji/Emoji";
import InfoPopover from '../InfoPopover/InfoPopover'

const skillMap = [
  { label: "Strength", key: "strength", emoji: "💪", description: "Weight workouts" },
  { label: "Defense", key: "defense", emoji: "🛡️", description: "Fiber intake" },
  { label: "Agility", key: "agility", emoji: "🤸", description: "Cardio workouts" },
  { label: "Intelligence", key: "intelligence", emoji: "🧠", description: "Fruits and vegetables" },
  { label: "Armor", key: "armor", emoji: "🪖", description: "Protein intake" },
  { label: "Speed", key: "speed", emoji: "💨", description: "Hydration" },
  { label: "Happiness", key: "happiness", emoji: "🤗", description: "Calorie goal adherence" },
];

const SkillsPage = () => {
 const { userData } = useUser();

  if (!userData) return null;

  const { pet } = userData;

  return (
    <FlexLayout direction="column" gap={3} style={{ padding: "1rem" }}>
      <FlexLayout direction={'row'} gap={1} align="center" style={{ alignItems: "center" }}>
        <Emoji style={{ alignItems: "center" }} symbol="🎮" size={30} />
      <Text styleAs="h2"  style={{
      fontFamily: "'Press Start 2P', Open Sans",
      margin: 0,
      padding: 0,
    }}>
        Pet Skills
      </Text>
      </FlexLayout>
      {skillMap.map((skill) => (
        <Card
          key={skill.key}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#111",
            border: "1px solid #444",
            borderRadius: "12px",
            boxShadow: "0 0 8px #00ffc3",
          }}
        >
          <FlexLayout justify="space-between" align="center">
            <FlexLayout align="center" gap={1}>
              <Emoji symbol={skill.emoji} size={20} />
              <Text
                style={{
                  fontFamily: "'Press Start 2P', Open Sans",
                  fontSize: "1.2rem",
                  color: "#fff",
                }}
              >
                {skill.label}
              </Text>
                 <InfoPopover content={skill.description} />
            </FlexLayout>

            <Text style={{ color: "#fff", fontSize: "1.2rem" }}>
              Level {pet[skill.key as keyof typeof pet]}
            </Text>
          </FlexLayout>
        </Card>
      ))}
    </FlexLayout>
  );
}

export default SkillsPage;
