import { Exhibit, Project } from "models";
import type { NextApiRequest, NextApiResponse } from "next";
import { getExhibits, getProject } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ project: Project; exhibits: Exhibit[] }>
) {
  const project = await getProject();
  const exhibits = await getExhibits();
  return res.status(200).json({ project, exhibits });
}
