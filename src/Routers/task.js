import express from "express";

import * as taskController from "../controllers/taskController.js";

import {
  validateCreateTask,
  validateUpdateTask,
} from "../validator/taskValidator.js";

import { authenticate } from "../middleware/authentication.js";

import { validateId } from "../middleware/validateId.js";
const router = express.Router();

router.use(authenticate);


router.post("/", validateCreateTask, taskController.createTask);

router.get("/", taskController.getTasks);

//Get tasks by status
router.get("/active", taskController.getActiveTasks);
router.get("/completed", taskController.getCompletedTasks);

// Get task statistics
router.get("/stats", taskController.getTaskStats);

// Create new task


// GET /api/v1/tasks/stats

// GET /api/v1/tasks/:id
// Get single task
router.get("/:id", validateId(), taskController.getTask);

router.patch("/:id", validateUpdateTask, taskController.updateTask);

router.delete("/:id",validateId(), taskController.deleteTask);

// GET /api/v1/tasks/project/:projectId
// Get tasks for a specific project
router.get("/project/:projectId", taskController.getProjectTasks);
router.post("/:id/complete",validateId(), taskController.markComplete);
router.post("/:id/active", validateId(), taskController.markActive);
router.post("/:id/archived", validateId(), taskController.markArchived);

export default router;
