

import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { 
  getMyActivities, 
  getProjectActivities, 
  getActivityStats 
} from '../controllers/activityController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/my-activities', getMyActivities);
router.get('/stats', getActivityStats);
router.get('/project/:projectId', getProjectActivities);

export default router;