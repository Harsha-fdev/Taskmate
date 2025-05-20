import { db } from "../db/db_connect";
import { project } from "../models/project_schema";
import { Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import { eq } from "drizzle-orm";

//POST /project
export const project_details = AsyncHandler(async (req: Request, res: Response) => {
  const { id, name, description, userId } = req.body;

  await db.insert(project).values({
    name,
    description,
    userId,
    id
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
  });
});

//GET /projects/:userId
export const getUserProjects = AsyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const projects = await db.select().from(project).where(eq(project.userId, userId));

  res.status(200).json({
    success: true,
    data: projects,
  });
});

//  PUT /projects/:id
export const updateProject = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  await db.update(project)
    .set({ name, description })
    .where(eq(project.id, id));

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
  });
});

//  DELETE /projects/:id
export const deleteProject = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.delete(project).where(eq(project.id, id));

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
