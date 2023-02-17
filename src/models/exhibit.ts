import { StringPublicKey } from "@nfteyez/sol-rayz/dist/types";
import { NFT } from "./nfts";
import { StrapiMeta, StrapiPagination } from "./strapi";

export interface Exhibit {
  clicks: StringPublicKey[];
  coverPhoto: string;
  curator: string;
  description: string;
  id: number;
  meta: StrapiMeta;
  mints: StringPublicKey[];
  nfts: NFT[];
  title: string;
}
