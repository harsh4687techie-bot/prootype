import asyncHandler from 'express-async-handler';
import { listPublicProjects, createProject, updateProject, deleteProject } from '../services/projectService.js';

export const getProjects = asyncHandler(async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  const data = await listPublicProjects({ page: Number(page), perPage: Number(perPage) });
  res.json(data);
});

export const createNewProject = asyncHandler(async (req, res) => {
  const project = await createProject(req.user.id, req.body);
  res.status(201).json(project);
});

export const editProject = asyncHandler(async (req, res) => {
  const project = await updateProject(req.params.id, req.user.id, req.body);
  res.json(project);
});

export const removeProject = asyncHandler(async (req, res) => {
  await deleteProject(req.params.id, req.user.id);
  res.status(204).send();
});
