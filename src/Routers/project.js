import express from 'express';
const router = express.Router();

import * as projectController from '../controllers/projectController.js';
import * as taskController from '../controllers/taskController.js'; 
import { validateCreateProject, validateUpdateProject } from '../validator/projectValidator.js';
import { authenticate } from '../middleware/authentication.js';

// All routes require authentication
router.use(authenticate);

router.post('/', authenticate, validateCreateProject, projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.patch('/:id', authenticate, validateUpdateProject, projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);

router.get('/:projectId/tasks', taskController.getProjectTasks);
export default router;