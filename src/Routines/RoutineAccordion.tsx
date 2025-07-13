import { useRef, useState } from "react";
import "./RoutineAccordion.css";
import type { Routine } from "../types/routine.types";
import { Disclosure, DisclosureButton, DisclosurePanel, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MoreVertical, ChevronDown } from "lucide-react";
import { Menu } from "@headlessui/react";
import api from "../api/api";
import { useUser } from "../context/UserContext";


type RoutineAccordionProps = {
  routine: Routine[] | undefined;
  menuOptions: string[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[] | undefined>>;
};

export default function RoutineAccordion({ routine, setRoutines, menuOptions }: RoutineAccordionProps) {
  const {userData} = useUser();
  if (!routine || routine.length === 0) return null;

  const handleDelete = (routineId: string) => {
    console.log("Delete", routineId);
    api.delete(`/routines/delete/${routineId}`).then(() => {
      setRoutines(prev => prev?.filter(r => r._id !== routineId));
    }).catch((err) =>{
      console.error('Failed to delete routine: ', err)
;    });
  };

  const handleShare = (routine: Routine) => {
    console.log("Share ", routine._id);
    const updatedRoutine = {
      ...routine,
      communityRoutine: true,
    };
    api.patch(`/routines/update/${routine._id}`, updatedRoutine).then(() => {
    }).catch((err) =>{
      console.error('Failed to share routine: ', err)
;    });
  };

  const handleCopy = (routine: Routine) => {
    api.post(`/routines/copy/${routine._id}`, {
      userId: userData?.uid,
    })
    .then((res) => {
      console.log('Copied routine:', res.data.routine);
      setRoutines?.(prev => [...(prev || []), res.data.routine]);
    })
    .catch((err) => {
      console.error('Failed to copy routine:', err);
    });
  };

  return (
    <div className="routine-accordion-list">
      {routine.map((r, idx) => (
        <div className="routine-accordion" key={r.routineName + idx}>
          <Disclosure>
            {({ open }) => (
              <>
 <div className="accordion-header">
        {/* Clickable area for expanding */}
        <DisclosureButton className="accordion-trigger">
        <ChevronDown size={32} className={`chevron ${open ? "open" : ""}`} />
          <span className="routine-title">{r.routineName}</span>
        </DisclosureButton>

        {/* Non-clickable menu */}
        <Menu as="div" className="menu-wrapper">
          <MenuButton className="menu-button" onClick={(e) => e.stopPropagation()}>
            <MoreVertical size={20} />
          </MenuButton>
          <MenuItems className="menu-dropdown">
          {menuOptions.includes("Share") && (
    <MenuItem>
      <button onClick={() => handleShare(r)} className="menu-item">
        Share
      </button>
    </MenuItem>
  )}
  {menuOptions.includes("Delete") && (
    <MenuItem>
      <button onClick={() => handleDelete(r._id!)} className="menu-item">
        Delete
      </button>
    </MenuItem>
  )}
  {menuOptions.includes("Copy") && (
    <MenuItem>
      <button
        onClick={() => handleCopy(r)}
        className="menu-item"
      >
        Copy
      </button>
    </MenuItem>
  )}
          </MenuItems>
        </Menu>
      </div>
                <DisclosurePanel className="accordion-panel">
                  <div className="carousel-container">
                    {r.weeklySchedule.map((day, index) => (
                      <div
                        key={day.dayName + index}
                        className="carousel-card"
                      >
                        <div className="day-title">{day.dayName}</div>
                        <div className="day-exercises">
                          {day.exercises.map((exercise) => exercise.exercise).join(", ")}
                        </div>
                        <button className="start-button">START WORKOUT</button>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  );
}