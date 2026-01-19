import projectRepository from '../repository/projectRepository.js';
import AppError from '../utils/appError.js';

class ProjectService {
  
  async createProject(projectData, userId) {
    // Add user ID to project data
    const project = await projectRepository.create({
      ...projectData,
      userId
    });

    return {
      id: project.id,
      userId: project.user_id,
      name: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };
  }

  async getProjects(userId, filters) {
    const projects = await projectRepository.findByUserId(userId, filters);

    return projects.map(project => ({
      id: project.id,
      userId: project.user_id,
      name: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }));
  }

  async getProjectById(projectId, userId) {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check ownership
    if (project.user_id !== userId) {
      throw new AppError('You do not have permission to access this project', 403);
    }

    return {
      id: project.id,
      userId: project.user_id,
      name: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };
  }

  async updateProject(projectId, updates, userId) {
    // Check if project exists and user owns it
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (project.user_id !== userId) {
      throw new AppError('You do not have permission to update this project', 403);
    }

    const updatedProject = await projectRepository.update(projectId, updates);

    return {
      id: updatedProject.id,
      userId: updatedProject.user_id,
      name: updatedProject.name,
      description: updatedProject.description,
      status: updatedProject.status,
      createdAt: updatedProject.created_at,
      updatedAt: updatedProject.updated_at
    };
  }

  async deleteProject(projectId, userId) {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (project.user_id !== userId) {
      throw new AppError('You do not have permission to delete this project', 403);
    }

    await projectRepository.delete(projectId);
  }
}

export default new ProjectService();