
import taskRepository from '../repository/taskRepository.js';
import projectRepository from '../repository/projectRepository.js';

import AppError from '../utils/appError.js';



class TaskService {
  
  async createTask(taskData, userId) {
    
    const { projectId } = taskData;
    
    const project = await projectRepository.findById(projectId);
    
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    if (project.user_id !== userId) {
      throw new AppError(
        'You cannot create tasks in a project you do not own', 
        403
      );
    }
   

    // Create the task
    const task = await taskRepository.create({
      ...taskData,
      userId  // Add user ID
    });


    return {
      id: task.id,
      projectId: task.project_id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      projectName: task.project_name
    };
  }


  
  async getTasks(userId, filters) {

    

    const tasks = await taskRepository.findAll({
      userId,  // Always filter by current user
      ...filters
    });


    return tasks.map(task => ({
      id: task.id,
      projectId: task.project_id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      projectName: task.project_name
    }));
  }


  
  async getTaskById(taskId, userId) {
   
    const task = await taskRepository.findById(taskId);

    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

   
    const canAccess = await taskRepository.canUserAccessTask(taskId, userId);
    
    if (!canAccess) {
      throw new AppError(
        'You do not have permission to access this task', 
        403
      );
    }
   
    return {
      id: task.id,
      projectId: task.project_id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      projectName: task.project_name
    };
  }

  
  
  async updateTask(taskId, updates, userId) {

    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const canAccess = await taskRepository.canUserAccessTask(taskId, userId);
    
    if (!canAccess) {
      throw new AppError(
        'You do not have permission to update this task', 
        403
      );
    }

   
    const updatedTask = await taskRepository.update(taskId, updates);

  
    return {
      id: updatedTask.id,
      projectId: updatedTask.project_id,
      userId: updatedTask.user_id,
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      status: updatedTask.status,
      dueDate: updatedTask.due_date,
      completedAt: updatedTask.completed_at,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at
    };
  }


  
  async deleteTask(taskId, userId) {
 
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

  
    const canAccess = await taskRepository.canUserAccessTask(taskId, userId);
    
    if (!canAccess) {
      throw new AppError(
        'You do not have permission to delete this task', 
        403
      );
    }

    await taskRepository.delete(taskId);
  }

 
  
  async getProjectTasks(projectId, userId) {
   
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (project.user_id !== userId) {
      throw new AppError(
        'You do not have permission to view tasks for this project', 
        403
      );
    }

   
    const tasks = await taskRepository.findByProjectId(projectId, userId);

 
    return tasks.map(task => ({
      id: task.id,
      projectId: task.project_id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    }));
  }

  
  async getTaskStatistics(userId) {

    const stats = await taskRepository.getTaskStats(userId);
    
 
    const overdueTasks = await taskRepository.getOverdueTasks(userId);

    return {
      byStatus: stats,
 
      
      overdue: {
        count: overdueTasks.length,
        tasks: overdueTasks.map(task => ({
          id: task.id,
          title: task.title,
          dueDate: task.due_date,
          projectName: task.project_name
        }))
      }
    };
  }

 
  
  async markTaskComplete(taskId, userId) {
 
    
    return this.updateTask(taskId, { status: 'done' }, userId);
  }
}


export default new TaskService();