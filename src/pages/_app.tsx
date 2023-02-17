import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { ToastContainer } from "react-toastify";
import {
  Footer,
  Navbar,
  NFTDetailModal,
  PerformanceModal,
} from "../components";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import "react-toastify/dist/ReactToastify.css";
import { useAppState } from "hooks/useAppState";
import { fetcher } from "utils";

const endpoint = process.env.NEXT_PUBLIC_RPC_URL!;

function getLibrary(provider: any) {
  return new Web3(provider);
}

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  const { setProject, setExhibits } = useAppState();

  useEffect(() => {
    const getExhibits = async () => {
      const { project, exhibits } = await fetcher(`/api/exhibits`);
      setProject(project);
      setExhibits(exhibits);
    };

    getExhibits();
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletProvider>
          <Navbar />
          <ToastContainer
            position="top-right"
            theme="dark"
            limit={2}
            autoClose={1500}
            pauseOnFocusLoss={false}
          />
          <NFTDetailModal />
          <PerformanceModal />
          <Component {...pageProps} />
          <Footer />
        </WalletProvider>
      </Web3ReactProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
