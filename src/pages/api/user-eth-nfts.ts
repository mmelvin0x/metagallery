import type { NextApiRequest, NextApiResponse } from "next";
import { getUserETHNFTs } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { publicKey } = req.query;
  const response = await getUserETHNFTs(publicKey.toString());
  return res.status(200).json(response);
}
