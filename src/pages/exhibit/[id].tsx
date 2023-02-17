import { useWallet } from "@solana/wallet-adapter-react";
import { SceneLayout, NFTsScene } from "components";
import { useAppState } from "hooks";
import { NFT, Exhibit } from "models";
import type { NextPage } from "next";
import Head from "next/head";
import router, { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getExhibit,
  ERROR_MESSAGES,
  INFO_MESSAGES,
  getNFTsFromMints,
  SUCCESS_MESSAGES,
} from "utils";

const Exhibits: NextPage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { connected } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { project, selectedExhibit, setSelectedExhibit } = useAppState();

  const setError = async (message: string) => {
    setNfts([]);
    setSelectedExhibit({} as Exhibit);
    setLoaded(true);
    toast.error(message);
    await router.push("/");
  };

  const getNfts = async () => {
    const ex: Exhibit = await getExhibit(id?.toString() || "");

    if (!ex?.id) {
      await setError(ERROR_MESSAGES.EXHIBIT_NOT_FOUND);
      return;
    }

    setSelectedExhibit(ex);

    toast.info(INFO_MESSAGES.EXHIBIT_LOADING);
    const { mints } = ex;
    const nfts = await getNFTsFromMints(mints);

    if (!nfts?.length) {
      await setError(ERROR_MESSAGES.EXHIBIT_NOT_FOUND);
      return;
    }

    setNfts(nfts);
    setLoaded(true);
    toast.success(SUCCESS_MESSAGES.EXHIBIT_LOADED);
  };

  useEffect(() => {
    if (!loaded) {
      try {
        getNfts();
      } catch (e: any) {
        setError(e.message);
      }
    } else {
      setNfts([]);
      setSelectedExhibit({} as Exhibit);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Exhibits | Metagallery</title>
        <meta name="description" content="Powering the metaverse" />
      </Head>

      <SceneLayout needsWallet={false} connected={connected} loaded={loaded}>
        {project && selectedExhibit && (
          <NFTsScene
            project={project}
            exhibit={selectedExhibit}
            router={router}
            nfts={nfts}
          />
        )}
      </SceneLayout>
    </>
  );
};

export default Exhibits;
