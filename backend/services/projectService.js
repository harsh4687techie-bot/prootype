import { prisma } from '../app.js';

export async function listPublicProjects({ page = 1, perPage = 10 }) {
  const skip = (page - 1) * perPage;
  const [projects, total] = await Promise.all([
    prisma.project.findMany({ where: { public: true }, skip, take: perPage, orderBy: { createdAt: 'desc' } }),
    prisma.project.count({ where: { public: true } })
  ]);
  return { projects, total };
}

export async function createProject(ownerId, payload) {
  return prisma.project.create({ data: { ...payload, ownerId } });
}

export async function updateProject(projectId, ownerId, payload) {
  const exist = await prisma.project.findUnique({ where: { id: projectId } });
  if (!exist || exist.ownerId !== ownerId) throw Object.assign(new Error('Not found'), { status: 404 });
  return prisma.project.update({ where: { id: projectId }, data: payload });
}

export async function deleteProject(projectId, ownerId) {
  const exist = await prisma.project.findUnique({ where: { id: projectId } });
  if (!exist || exist.ownerId !== ownerId) throw Object.assign(new Error('Not found'), { status: 404 });
  return prisma.project.delete({ where: { id: projectId } });
}
