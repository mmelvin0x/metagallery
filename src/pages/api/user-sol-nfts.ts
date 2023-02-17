import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSOLNFTs } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { publicKey } = req.query;
  const response = await getUserSOLNFTs(publicKey.toString());
  return res.status(200).json(response);
}
