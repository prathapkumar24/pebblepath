const express = require("express");
const router = express.Router();
const babyController = require("../controllers/babyController");

// Baby routes
//router.get("/createMilestones", babyController.createMilestones);
router.post("/", babyController.createBaby);
router.get("/", babyController.getAllBabies);
router.get("/:id", babyController.getBabyById);
router.put("/:id", babyController.updateBaby);
router.delete("/:id", babyController.deleteBaby);

// Milestone routes
router.post("/:id/milestones", babyController.addMilestone);
router.put("/:id/milestones/:milestoneId", babyController.updateMilestone);
router.delete("/:id/milestones/:milestoneId", babyController.deleteMilestone);



module.exports = router;
