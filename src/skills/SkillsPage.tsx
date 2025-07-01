import { FlexLayout, FlexItem, Card, Text, LinearProgress } from "@salt-ds/core";
import styles from "./SkillsPage.module.scss"; // Assuming you have a CSS module for styles

const skills = [
  { name: "Strength", level: 3, xp: 60, xpNeeded: 100 },
  { name: "Endurance", level: 2, xp: 30, xpNeeded: 80 },
  { name: "Speed", level: 4, xp: 90, xpNeeded: 120 },
];

const SkillsPage = () => {
  return (
    <FlexLayout direction="column" gap={2} style={{ padding: "1rem" }}>
      <Text styleAs="h2" style={{ marginBottom: "1rem" }}>Your Skills</Text>

      {skills.map((skill) => {
        const percent = (skill.xp / skill.xpNeeded) * 100;

        return (
          <Card key={skill.name} style={{ width: "100%" }}>
              <FlexLayout justify="space-between" align="center">
                <Text styleAs="h4">{skill.name}</Text>
                <Text>Level {skill.level}</Text>
              </FlexLayout>
              <LinearProgress value={percent} style={{ marginTop: "0.5rem" }} />
              <Text style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {skill.xp} / {skill.xpNeeded} XP
              </Text>
          </Card>
        );
      })}
    </FlexLayout>
  );
};

export default SkillsPage;
