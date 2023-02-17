import { StringPublicKey } from "@metaplex-foundation/mpl-core";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
} from "@nfteyez/sol-rayz";
import { getNFTByMintAddress } from "@primenums/solana-nft-tools";
import { Connection } from "@solana/web3.js";
import axios, { AxiosResponse } from "axios";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import { config } from "../config";
import {
  Exhibit,
  NFT,
  ParsedAccountConfig,
  Project,
  StrapiGetById,
  StrapiPagination,
} from "../models";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./constants";
import { shapeNFTData } from "./general-utils";

export const getProject = async (): Promise<Project> => {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
  console.log(projectId);
  const url = `${config.cmsBaseUrl}/api/projects/${projectId}?populate=*`;

  try {
    const { data }: AxiosResponse<StrapiGetById<Project>> = await axios.get(
      url
    );
    const response = data.data.attributes;
    response.coverPhoto =
      // TODO: fix typing
      // @ts-ignore
      config.cmsBaseUrl + response.coverPhoto.data.attributes.url;
    // TODO: fix typing
    // @ts-ignore
    response.exhibits = response.gallery.data.map((it) => it.attributes);

    console.log(response);
    return response;
  } catch (e: any) {
    toast.error(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    return {} as Project;
  }
};

export const getExhibits = async (): Promise<Exhibit[]> => {
  const url = config.cmsBaseUrl + "/api/exhibits?populate=coverPhoto";

  try {
    const exhibits: AxiosResponse<{
      data: { id: number; attributes: Exhibit }[];
      meta: { pagination: StrapiPagination };
    }> = await axios.get(url);

    let { data } = exhibits.data;
    return data.map((it: { attributes: Exhibit; id: number }) => ({
      ...it.attributes,
      id: it.id,
      coverPhoto:
        // TODO: fix typing
        // @ts-ignore
        config.cmsBaseUrl + it.attributes.coverPhoto.data.attributes.url,
    }));
  } catch (e: any) {
    toast.error(ERROR_MESSAGES.EXHIBITS_NOT_FOUND);
    console.error(ERROR_MESSAGES.PROJECT_NOT_FOUND, e?.message);
    return [];
  }
};

export const getExhibit = async (id: string): Promise<Exhibit> => {
  const url = `${config.cmsBaseUrl}/api/exhibits/${id}?populate=coverPhoto`;

  try {
    let { data } = await axios.get(url); // TODO: type this response
    data = data.data;
    return {
      id: data.id,
      ...data.attributes,
      coverPhoto:
        // TODO: fix typing
        // @ts-ignore
        config.cmsBaseUrl + data.attributes.coverPhoto.data.attributes.url,
    };
  } catch (e: any) {
    toast.error(ERROR_MESSAGES.EXHIBIT_NOT_FOUND);
    console.error(ERROR_MESSAGES.EXHIBIT_NOT_FOUND);
    return {} as Exhibit;
  }
};

export const getNftFromMint = async (
  mint: StringPublicKey,
  tokenId?: string
): Promise<NFT> => {
  const connection = new Connection(config.rpcUrl);
  const url = process.env.NEXT_PUBLIC_NFT_API;

  if (!url) {
    toast.error("NFT API is not configured for this project");
    console.error("NFT API is not configured for this project");
    return {} as NFT;
  }

  let nft = {} as NFT;

  if (isValidSolanaAddress(mint)) {
    try {
      const { data }: AxiosResponse<NFT> = await axios.get(
        `${url}/nft?contract=${mint}&metadata=${true}&isMobile=${isMobile}`
      );

      nft = shapeNFTData(data);
    } catch (e: any) {
      const solNft = await getNFTByMintAddress(connection, mint);
      nft = shapeNFTData(solNft);
    }
  } else if (!tokenId) {
    const split = mint.split("/");
    const address = split[0];
    const id = split[1];
    const { data }: AxiosResponse<NFT> = await axios.get(
      `${url}/nft?contract=${address}&id=${id}&metadata=${true}&isMobile=${isMobile}`
    );

    nft = shapeNFTData(data);
  } else {
    const { data }: AxiosResponse<NFT> = await axios.get(
      `${url}/nft?contract=${mint}&id=${tokenId}&metadata=${true}&isMobile=${isMobile}`
    );

    nft = shapeNFTData(data);
  }

  return nft.mint ? nft : ({} as NFT);
};

export const getNFTsFromMints = async (
  mints: StringPublicKey[]
): Promise<NFT[]> => {
  // const nfts: Array<Promise<NFT>> = [];
  const nfts: NFT[] = [];
  const url = process.env.NEXT_PUBLIC_NFT_API;

  if (!url) {
    toast.error("NFT API is not configured for this project");
    console.error("NFT API is not configured for this project");
    return [];
  }

  // mints.map((mint: string) => {
  //   try {
  //     const nft = getNftFromMint(mint);
  //     nfts.push(nft);
  //   } catch (e: any) {
  //     console.error(e.message);
  //   }
  // });

  for (let i = 0; i < mints.length; i++) {
    try {
      const nft = await getNftFromMint(mints[i]);

      if (nft?.image) {
        nfts.push(nft);
      }
    } catch (e: any) {
      console.error(e.message);
      continue;
    }
  }

  // return await Promise.all(nfts);
  return nfts;
};

export const sendCLX = async (
  publicKey: StringPublicKey,
  id: string
): Promise<void> => {
  // TODO: Each Exhibit will need to be an account/nft on-chain and get it's likes incremented
  // TODO: Future may charge/send CLX for clicking, for now web2
  const exhibit = await getExhibit(id);
  const url = `${config.cmsBaseUrl}/api/exhibits/${id}`;
  const publicKeyString = publicKey.toString();

  if (exhibit?.clicks.includes(publicKeyString)) {
    toast.error(ERROR_MESSAGES.ALREADY_CLICKED);
  } else {
    try {
      exhibit.clicks.push(publicKeyString);
      await axios.put(url, { data: exhibit });
      toast.success(SUCCESS_MESSAGES.CLICKED);
    } catch (e: any) {
      toast.error(e.message);
      console.warn(e.message);
    }
  }
};

export const getUserSOLNFTs = async (
  publicKey: StringPublicKey,
  parsedAccountConfig?: ParsedAccountConfig
): Promise<NFT[]> => {
  const endpoint = config.rpcUrl;
  const connection = new Connection(endpoint);

  if (!parsedAccountConfig) {
    parsedAccountConfig = {
      publicAddress: publicKey.toString(),
      connection,
      sort: false,
      limit: 10,
    };
  }

  const parsedAccounts = await getParsedNftAccountsByOwner(parsedAccountConfig);

  if (!parsedAccounts.length) {
    toast.error(ERROR_MESSAGES.NO_NFTS_FOUND);
    return [];
  }

  const mints = Array.from(
    new Set(
      parsedAccounts.map((it: any) => {
        return it.mint;
      })
    )
  );

  return await getNFTsFromMints(mints);
};

export const getUserETHNFTs = async (address: string): Promise<NFT[]> => {
  const nfts = [];
  const url = process.env.NEXT_PUBLIC_MORALIS_API;
  const key = process.env.NEXT_PUBLIC_MORALIS_KEY;

  if (!url || !key) {
    toast.error("NFT API is not configured for this project");
    console.error("NFT API is not configured for this project");
    return [];
  }

  try {
    const { data } = await axios.get(`${url}/${address}/nft?limit=${10}`, {
      headers: { "X-API-KEY": key },
    });
    const mints = data?.result.map(
      (it: any) => `${it.token_address}/${it.token_id}`
    );
    const ownedNfts = await getNFTsFromMints(mints);

    if (ownedNfts?.length) {
      for (let i = 0; i < ownedNfts.length; i++) {
        const nft = await shapeNFTData(ownedNfts[i]);

        if (nft?.image) {
          nfts.push(nft);
        }
      }
    }

    return nfts;
  } catch (e: any) {
    toast.error(e.message);
    console.error(e.message);

    return [];
  }
};
