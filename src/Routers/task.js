import express from 'express';

import * as taskController from '../controllers/taskController.js';

import { 
  validateCreateTask, 
  validateUpdateTask 
} from '../validator/taskValidator.js';



import { authenticate } from '../middleware/authentication.js';

const router = express.Router();

router.use(authenticate);

router.get('/', taskController.getTasks);

// Create new task
router.post('/', validateCreateTask, taskController.createTask);

// GET /api/v1/tasks/stats
// Get task statistics
router.get('/stats', taskController.getTaskStats);


// GET /api/v1/tasks/:id
// Get single task
router.get('/:id', taskController.getTask);


router.patch('/:id', validateUpdateTask, taskController.updateTask);


router.delete('/:id', taskController.deleteTask);

// GET /api/v1/tasks/project/:projectId
// Get tasks for a specific project
router.get('/project/:projectId', taskController.getProjectTasks);
router.post('/:id/complete', taskController.markComplete);

export default router;