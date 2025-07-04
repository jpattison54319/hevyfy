import { useState } from "react";
import Popover from "@mui/material/Popover";
import Emoji from "..//Emoji/Emoji";

const InfoPopover = ({ content }: { content: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <span onClick={handleClick} style={{ cursor: "pointer", marginLeft: 4 }}>
        <Emoji symbol="ℹ️" label="info" size={14} />
      </span>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
         slotProps={{
  paper: {
    sx: {
      bgcolor: "#1a1a1a", // slightly lighter than card
      color: "#e0e0e0",   // light gray for better readability
      fontFamily: "'Press Start 2P', cursive",
      fontSize: "0.65rem",
      px: 2,
      py: 1,
      maxWidth: 200,
      borderRadius: 1,
      border: "1px solid #333", // minimal border
      boxShadow: "0 0 4px rgba(0, 255, 195, 0.3)", // soft glow
    },
  },
}}
      >
        {content}
      </Popover>
    </>
  );
};

export default InfoPopover;