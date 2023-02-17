import { StringPublicKey } from "@metaplex-foundation/mpl-core";
import { Connection } from "@solana/web3.js";

export interface NFT {
  tokenId?: string;
  owner: string;
  mint: string;
  name: string;
  description?: string;
  image: string;
  imageType: "image" | "video" | "html" | "Unknown";
  animation_url?: string;
  externalUrl: string;
  external_url?: string;
  attributes?: NFTAttribute[];
  properties?: NFTProperty;
  error?: string;
  isSolana?: boolean;
  isEth?: boolean;
  collection?: {
    family: string;
    name: string;
  };
}

export interface NFTAttribute {
  name: string;
  value: string;
}

export interface NFTProperty {
  files: NFTFile[];
  category: string;
}

export interface NFTFile {
  type: string;
  src: string;
}

export interface ParsedAccountConfig {
  publicAddress: StringPublicKey;
  connection: Connection;
  sort: boolean;
  limit: number;
}
