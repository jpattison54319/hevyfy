import express from "express";
import User from '../models/User.js';
import MiniBoss from '../models/MiniBoss.js';
const router = express.Router();

router.get("/:uid", async (req, res) => {
    try {
      const {uid} = req.params; // Assume middleware adds this from token/session
  
      if (!uid) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const user = await User.findOne({ uid: uid });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const chapter = user.currentChapter ?? 1;
  
      const bosses = await MiniBoss.find({ chapter }).sort({ bossNumber: 1 });
  
      return res.json({ bosses, chapter });
    } catch (error) {
      console.error("Error fetching mini bosses:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/defeatBoss/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
  
      if (!uid) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const user = await User.findOne({ uid });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const chapter = user.currentChapter ?? 1;
      const bossNumber = user.currentBossNumber ?? 1;
  
      // Check if boss is already defeated
      const alreadyDefeated = user.defeatedBosses.some(
        (b) => b.chapter === chapter && b.bossNumber === bossNumber
      );
  
      if (alreadyDefeated) {
        return res.status(400).json({ message: "Boss already defeated" });
      }
  
      // Mark boss as defeated
      user.defeatedBosses.push({ chapter, bossNumber });
  
      // Get total bosses in this chapter
      const totalBossesInChapter = await MiniBoss.countDocuments({ chapter });
  
      const isFinalBoss = bossNumber === totalBossesInChapter;
  
      if (isFinalBoss) {
        user.currentChapter += 1;
        user.currentBossNumber = 1;
      } else {
        user.currentBossNumber += 1;
      }
  
      await user.save();
  
      return res.status(200).json({
        message: `Defeated boss ${bossNumber} in chapter ${chapter}`,
        updatedUser: user,
      });
    } catch (error) {
      console.error("Error defeating boss:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  export default router;