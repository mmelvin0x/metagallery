import type { NextApiRequest, NextApiResponse } from "next";
import { getNftFromMint } from "utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { mint, tokenId } = req.query;

  if (!mint) {
    return res.status(404).json(null);
  }

  const response = await getNftFromMint(mint.toString(), tokenId?.toString());
  return res.status(200).json(response);
}
