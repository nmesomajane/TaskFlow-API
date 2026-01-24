import asyncHandler from '../utils/asyncHandler.js';
import taskService from '../services/taskService.js';

export const createTask = asyncHandler(async (req, res) => {
const taskData = req.body;

const userId = req.user.id;

const task = await taskService.createTask(taskData, userId);

res.status(201).json({
status: 'success',
data: { task }
});
});


export const getTasks = asyncHandler(async (req, res) => {
const userId = req.user.id;

const { status, priority, projectId } = req.query;

const filters = {};
if (status) filters.status = status;
if (priority) filters.priority = priority;
if (projectId) filters.projectId = parseInt(projectId);

const tasks = await taskService.getTasks(userId, filters);

res.status(200).json({
status: 'success',
results: tasks.length,
data: { tasks }
});

});

export const getTask = asyncHandler(async (req, res) => {
const { id } = req.params;
const userId = req.user.id;
const task = await taskService.getTaskById(parseInt(id), userId);
res.status(200).json({
status: 'success',
data: { task }
});
});

export const updateTask = asyncHandler(async (req, res) => {
const { id } = req.params;
const updates = req.body;
const userId = req.user.id;
const task = await taskService.updateTask(parseInt(id), updates, userId);
res.status(200).json({
status: 'success',
data: { task }
});
});

export const deleteTask = asyncHandler(async (req, res) => {
const { id } = req.params;
const userId = req.user.id;
await taskService.deleteTask(parseInt(id), userId);
res.status(204).send();

});

export const getProjectTasks = asyncHandler(async (req, res) => {
const { projectId } = req.params;

const userId = req.user.id;
const tasks = await taskService.getProjectTasks(parseInt(projectId), userId);
res.status(200).json({
status: 'success',
results: tasks.length,
data: { tasks }
});
});

export const getTaskStats = asyncHandler(async (req, res) => {
const userId = req.user.id;
const stats = await taskService.getTaskStatistics(userId);
res.status(200).json({
status: 'success',
data: stats
});
});

export const markComplete = asyncHandler(async (req, res) => {
const { id } = req.params;
const userId = req.user.id;
const task = await taskService.markTaskComplete(parseInt(id), userId);
res.status(200).json({
status: 'success',
data: { task }
});
});