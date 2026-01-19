import projectService from '../services/projectService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createProject = asyncHandler(async (req, res) => {
  const projectData = req.body;
  const userId = req.user.id;

  const project = await projectService.createProject(projectData, userId);

  res.status(201).json({
    status: 'success',
    data: { project }
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query; // Filter from query params

  const projects = await projectService.getProjects(userId, { status });

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: { projects }
  });
});

export const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const project = await projectService.getProjectById(parseInt(id), userId);

  res.status(200).json({
    status: 'success',
    data: { project }
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.id;

  const project = await projectService.updateProject(parseInt(id), updates, userId);

  res.status(200).json({
    status: 'success',
    data: { project }
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await projectService.deleteProject(parseInt(id), userId);

  res.status(204).send();
});