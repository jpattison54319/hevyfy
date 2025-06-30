import React from "react";
import { FlexLayout, FlexItem, Card, Text, Divider, LinearProgress, Accordion, AccordionHeader, AccordionPanel, AccordionGroup } from "@salt-ds/core";

const quests = [
  { name: "First Workout", description: "Complete your first workout", status: "completed", progress: 100 },
  { name: "Protein Power", description: "Log a high-protein meal", status: "inProgress", progress: 60 },
  { name: "Hydration Hero", description: "Drink 8 glasses of water", status: "notStarted", progress: 0 },
  { name: "Consistency Counts", description: "Log workouts 3 days in a row", status: "inProgress", progress: 30 },
  { name: "Fiber Fiend", description: "Log a high-fiber day", status: "notStarted", progress: 0 },
  { name: "Beast Mode", description: "Reach 100 strength XP", status: "completed", progress: 100 },
];

const QuestCard = ({ name, description, progress }: { name: string; description: string; progress: number }) => (
  <Card style={{ width: "100%" }}>
      <Text styleAs="h4">{name}</Text>
      <Text style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.5rem" }}>{description}</Text>
      <LinearProgress value={progress} />
      <Text style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>{progress}% complete</Text>
  </Card>
);

const QuestsPage = () => {
  const inProgress = quests.filter((q) => q.status === "inProgress");
  const notStarted = quests.filter((q) => q.status === "notStarted");
  const completed = quests.filter((q) => q.status === "completed");

  return (
    <div style={{ padding: "1rem" }}>
      <Text styleAs="h2" style={{ marginBottom: "1rem" }}>Your Quests</Text>

      <AccordionGroup>
        <Accordion value={""}>
          <AccordionHeader>In Progress</AccordionHeader>
          <AccordionPanel>
            <FlexLayout direction="column" gap={2}>
              {inProgress.map((quest) => (
                <QuestCard key={quest.name} {...quest} />
              ))}
            </FlexLayout>
          </AccordionPanel>
        </Accordion>

        <Accordion value={""}>
          <AccordionHeader>Not Started</AccordionHeader>
          <AccordionPanel>
            <FlexLayout direction="column" gap={2}>
              {notStarted.map((quest) => (
                <QuestCard key={quest.name} {...quest} />
              ))}
            </FlexLayout>
          </AccordionPanel>
        </Accordion>

        <Accordion value={""}>
          <AccordionHeader>Completed</AccordionHeader>
          <AccordionPanel>
            <FlexLayout direction="column" gap={2}>
              {completed.map((quest) => (
                <QuestCard key={quest.name} {...quest} />
              ))}
            </FlexLayout>
          </AccordionPanel>
        </Accordion>
      </AccordionGroup>
    </div>
  );
};

export default QuestsPage;
