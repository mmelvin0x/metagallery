import { useWallet } from "@solana/wallet-adapter-react";
import { ExhibitsScene, SceneLayout } from "components";
import { useAppState } from "hooks";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ERROR_MESSAGES,
  fetcher,
  INFO_MESSAGES,
  SUCCESS_MESSAGES,
} from "utils";

const Home: NextPage = (props) => {
  const { connected } = useWallet();
  const [loaded, setLoaded] = useState(false);
  const { setProject, setExhibits, exhibits } = useAppState();
  const router = useRouter();

  const setError = async (message: string) => {
    setProject(null);
    setExhibits([]);
    setLoaded(true);
    toast.error(message);
  };

  useEffect(() => {
    const getExhibits = async () => {
      setLoaded(false);
      toast.info(INFO_MESSAGES.EXHIBITS_LOADING);
      const { project, exhibits } = await fetcher(`/api/exhibits`);
      console.log(project);
      setProject(project);
      setLoaded(true);

      if (exhibits?.length) {
        setExhibits(exhibits);
        toast.success(SUCCESS_MESSAGES.EXHIBITS_LOADED);
      } else {
        await setError(ERROR_MESSAGES.EXHIBITS_NOT_FOUND);
      }
    };

    if (!exhibits?.length) {
      try {
        getExhibits();
      } catch (e: any) {
        setError(e.message);
      }
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Metagallery | RightClickable</title>
        <meta name="description" content="Powering the metaverse" />
      </Head>

      <SceneLayout needsWallet={false} connected={connected} loaded={loaded}>
        <ExhibitsScene exhibits={exhibits} router={router} />
      </SceneLayout>
    </>
  );
};

export default Home;
