

import activityService from '../services/activityService.js';
import asyncHandler from '../middleware/asyncHandler.js';

// Get user's recent activities
export const getMyActivities = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit) || 20;
  
  const activities = await activityService.getUserActivities(userId, limit);
  
  res.status(200).json({
    status: 'success',
    data: {
      activities
    }
  });
});

// Get project activities
export const getProjectActivities = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  
  const activities = await activityService.getProjectActivities(projectId, limit);
  
  res.status(200).json({
    status: 'success',
    data: {
      activities
    }
  });
});

// Get activity statistics
export const getActivityStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const days = parseInt(req.query.days) || 7;
  
  const stats = await activityService.getActivityStats(userId, days);
  
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});