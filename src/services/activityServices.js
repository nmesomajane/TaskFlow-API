    // src/services/activityService.js

import ActivityRepository from '../repository/activityRepository.js';

class ActivityService {
  
  // Log an activity
  async logActivity(userId, activityType, entityType, entityId, metadata = {}) {
    const description = this.generateDescription(activityType, entityType, metadata);
    
    return await ActivityRepository.create({
      userId,
      activityType,
      entityType,
      entityId,
      description,
      metadata
    });
  }

  // Generate human-readable descriptions
  generateDescription(activityType, entityType, metadata) {
    const descriptions = {
      'task_created': `created a new task "${metadata.taskTitle}"`,
      'task_completed': `completed task "${metadata.taskTitle}"`,
      'task_updated': `updated task "${metadata.taskTitle}"`,
      'task_deleted': `deleted task "${metadata.taskTitle}"`,
      'task_status_changed': `changed status of "${metadata.taskTitle}" from ${metadata.oldStatus} to ${metadata.newStatus}`,
      'project_created': `created project "${metadata.projectName}"`,
      'project_updated': `updated project "${metadata.projectName}"`,
      'comment_added': `commented on "${metadata.taskTitle}"`,
      'user_assigned': `assigned "${metadata.taskTitle}" to ${metadata.assigneeName}`,
    };
    
    return descriptions[activityType] || `performed ${activityType} on ${entityType}`;
  }

  // Get user's recent activities
  async getUserActivities(userId, limit = 20) {
    const activities = await ActivityRepository.getRecentActivities(userId, limit);
    return this.formatActivities(activities);
  }

  // Get project activities
  async getProjectActivities(projectId, limit = 50) {
    const activities = await ActivityRepository.getProjectActivities(projectId, limit);
    return this.formatActivities(activities);
  }

  // Format activities for response
  formatActivities(activities) {
    return activities.map(activity => ({
      id: activity.id,
      type: activity.activity_type,
      description: activity.description,
      user: {
        id: activity.user_id,
        name: `${activity.first_name} ${activity.last_name}`,
        email: activity.email
      },
      entity: {
        type: activity.entity_type,
        id: activity.entity_id,
        title: activity.task_title || activity.project_name
      },
      metadata: activity.metadata,
      timestamp: activity.created_at
    }));
  }

  // Get activity statistics
  async getActivityStats(userId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const activities = await ActivityRepository.getActivitiesByDateRange(
      userId, 
      startDate, 
      new Date()
    );
    
    return {
      totalActivities: activities.length,
      tasksCreated: activities.filter(a => a.activity_type === 'task_created').length,
      tasksCompleted: activities.filter(a => a.activity_type === 'task_completed').length,
      projectsCreated: activities.filter(a => a.activity_type === 'project_created').length,
      commentsAdded: activities.filter(a => a.activity_type === 'comment_added').length
    };
  }
}

export default new ActivityService();