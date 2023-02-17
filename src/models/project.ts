import { StringPublicKey } from "@nfteyez/sol-rayz/dist/types";
import { StrapiVideo } from "./strapi";

export interface Project {
  id: number;
  name: string;
  shortName: string;
  description: string;
  shortDescription?: string;
  coverPhoto: string;
  smallPhoto?: string;
  mintDate?: Date;
  category: string;
  chain: "solana" | "ethereum";
  candyMachineId?: StringPublicKey;
  updateAuthority?: StringPublicKey;
  contractAddress?: string;
  mints: string[];
  externalUrl: string;
  twitterHandle: string;
  discordUrl?: string;
  creator: {
    data: {
      id: number;
      attributes: {
        blocked: boolean;
        confirmed: boolean;
        createdAt: Date;
        email: string;
        ethereumAddress: string;
        provider: string;
        solanaAddress: string;
        updatedAt: Date;
        username: string;
      };
    };
  };
  featuredVideoTitle: string;
  featureVideoUrl: string;
  featuredVideo: {
    id: number;
    data: {
      attributes: StrapiVideo;
    };
  };
}
