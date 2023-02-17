import { isValidSolanaAddress } from "@nfteyez/sol-rayz";
import { NFT } from "models";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "./constants";

export const goToTokenExplorer = (mint: string) => {
  let url = "";

  if (isValidSolanaAddress(mint)) {
    url = `https://solscan.io/token/${mint}`;
  } else {
    url = `https://opensea.io/assets/ethereum/${mint}`;
  }

  window.open(url, "_blank");
};

export const goToWalletExplorer = (walletAddress: string) => {
  let url = "";

  if (isValidSolanaAddress(walletAddress)) {
    url = `https://solscan.io/account/${walletAddress}`;
  } else {
    url = `https://etherscan.io/address/${walletAddress}`;
  }

  window.open(url, "_blank");
};

export const goToExternalUrl = (url?: string) => {
  if (url) {
    window.open(url, "_blank");
  } else {
    toast.error(ERROR_MESSAGES.NFT_URL_NOT_FOUND);
  }
};

export const shortenText = (text: string, length = 100) => {
  if (text.length < length) return text;
  return text.substring(0, length) + "...";
};

export const shortenAddress = (address: string): string => {
  if (!address) return "";

  const first3Characters = address.substring(0, 3);
  const last3Characters = address.substring(address.length - 3, address.length);

  return `${first3Characters}...${last3Characters}`;
};

export const shapeNFTData = (nft: any): NFT => {
  let newNft = {} as NFT;

  // Coming from our SOL index || solana blockchain
  if (isValidSolanaAddress(nft.mint)) {
    newNft = {
      ...nft,
      owner: nft.owner,
      mint: nft.mint,
      name: nft.name,
      description: nft.description || "",
      imageType: nft.imageType || nft.properties?.category,
      image:
        nft.properties?.category === "video" || nft.imageType === "video"
          ? nft.image || nft.animation_url
          : nft.image,
      // @ts-ignore
      externalUrl: nft.external_url || nft.externalUrl,
      attributes: (nft.attributes || []).map(
        (it: { trait_type?: string; name?: string; value: string }) => ({
          name: it.trait_type || it.name,
          value: it.value,
        })
      ),
      isSolana: true,
      isEth: false,
    };
    // Coming from moralis.io
  } else if (nft.metadata) {
    const meta = JSON.parse(nft.metadata);
    newNft = {
      ...nft,
      owner: nft.owner_of,
      name: nft.name || meta.name,
      description: nft.description || meta.description,
      mint: `${nft.token_address}/${nft.token_id}`,
      attributes: meta.attributes.map(
        (it: {
          trait_type?: string;
          display_type?: string;
          value: string;
        }) => ({
          name: it.trait_type,
          value:
            it.display_type === "data"
              ? new Date(it.value).toLocaleDateString()
              : it.value,
        })
      ),
      externalUrl: "",
      imageType: nft.image?.includes("video") ? "video" : "image",
      image: nft.image,
      isSolana: false,
      isEth: true,
    };
    // Coming from our ETH index
  } else {
    newNft = {
      ...nft,
      mint: nft.mint + "/" + nft.tokenId.toString(),
      isSolana: false,
      isEth: true,
    };
  }

  if (newNft.image?.includes("ext=gif")) {
    newNft.imageType = "image";
  }

  return newNft;
};
