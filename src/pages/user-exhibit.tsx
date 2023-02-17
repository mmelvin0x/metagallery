import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleOutline, XCircleOutline } from "heroicons-react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { LegacyRef, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { EthConnectButton, Loader, NFTsScene } from "../components";
import { useAppState } from "../hooks";
import { NFT } from "../models";
import {
  ERROR_MESSAGES,
  fetcher,
  INFO_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils";

const UserExhibit: NextPage = (props) => {
  const ref = useRef<HTMLInputElement>();
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { account } = useWeb3React();
  const [solLoading, setSOLLoading] = useState(false);
  const [solLoaded, setSOLLoaded] = useState(false);
  const [ethLoaded, setEthLoaded] = useState(false);
  const [ethLoading, setEthLoading] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { project } = useAppState();

  const isLoading = useMemo(() => {
    if (solLoading) return true;
    return ethLoading;
  }, [solLoading, ethLoading]);

  const setError = async (message: string) => {
    setNfts([]);
    setSOLLoading(false);
    setEthLoading(false);
    toast.error(message);
    await router.push("/");
  };

  const getSOLNfts = async () => {
    setSOLLoading(true);
    toast.info(INFO_MESSAGES.SOLANA_NFTS_LOADING);
    const response = await fetcher(`/api/user-sol-nfts?publicKey=${publicKey}`);

    if (response.length) {
      setNfts((state: NFT[]) => [...state, ...response]);
      toast.success(SUCCESS_MESSAGES.SOLANA_NFTS_LOADED);
      setSOLLoading(false);
    } else {
      await setError(ERROR_MESSAGES.NO_NFTS_FOUND);
    }
  };

  const getETHNfts = async () => {
    setEthLoading(true);
    toast.info(INFO_MESSAGES.ETH_NFTS_LOADING);
    const response = await fetcher(`/api/user-eth-nfts?publicKey=${account}`);

    if (response.length) {
      setNfts((state: NFT[]) => [...state, ...response]);
      toast.success(SUCCESS_MESSAGES.ETH_NFTS_LOADED);
      setEthLoading(false);
    } else {
      await setError(ERROR_MESSAGES.NO_NFTS_FOUND);
    }
  };

  const getBoth = async () => {
    if (connected && !solLoaded) {
      getSOLNfts();
      setSOLLoaded(true);
    }

    if (account && !ethLoaded) {
      getETHNfts();
      setEthLoaded(true);
    }
  };

  useEffect(() => {
    try {
      getBoth();
    } catch (e: any) {
      setError(e.message);
    }
  }, [connected, account]);
  return (
    <>
      <Head>
        <title>User Exhibit | Metagallery</title>
        <meta name="description" content="Powering the metaverse" />
      </Head>

      <>
        {project && !isLoading && (
          <NFTsScene project={project} router={router} nfts={nfts} />
        )}
        {(!project || isLoading) && <Loader />}
        <input
          id={"connect-modal"}
          ref={ref as LegacyRef<HTMLInputElement>}
          type="checkbox"
          className={"hidden modal-toggle"}
          defaultChecked
        />
        <div className={"modal"}>
          <div className="modal-box my-auto relative">
            {(solLoaded || ethLoaded) && (
              <label
                htmlFor={"connect-modal"}
                className="btn btn-sm btn-ghost btn-circle absolute right-2 top-2"
              >
                <XCircleOutline />
              </label>
            )}
            <div className="flex flex-col gap-3 justify-center items-center">
              <h1 className="text-2xl font-bold text-center">
                Connect your wallets
              </h1>
              <p className="text-center">
                Connect a Solana wallet or your Metamask wallet or both to see a
                random selection of NFTs from those wallets.
              </p>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-2">
                  {connected && <CheckCircleOutline />}
                  <Image
                    className={"rounded"}
                    src={"/assets/solana.png"}
                    alt={"Solana logo"}
                    width={25}
                    height={25}
                  />
                  {!connected && (
                    <WalletMultiButton className={"btn btn-outline"} />
                  )}

                  <EthConnectButton />
                  {account && <CheckCircleOutline />}
                  <Image
                    className={"rounded"}
                    src={"/assets/ethereum.png"}
                    alt={"Ethereum logo"}
                    width={25}
                    height={25}
                  />
                </div>
              </div>
              <button
                onClick={() => router.push("/")}
                className="btn btn-outline btn-circle mx-3"
              >
                back
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default UserExhibit;
