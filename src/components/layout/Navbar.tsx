import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { EthConnectButton } from "components";
import { useAppState } from "hooks/useAppState";
import Link from "next/link";
import { FC } from "react";

export const Navbar: FC = () => {
  const { project } = useAppState();

  return (
    <nav className="navbar w-screen absolute z-10">
      <section className="flex justify-end w-screen">
        <div className="dropdown dropdown-end">
          <div className="btn btn-ghost flex flex-col gap-1" tabIndex={0}>
            <div className="h-1 w-6 bg-white"></div>
            <div className="h-1 w-6 bg-white"></div>
            <div className="h-1 w-6 bg-white"></div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content flex flex-col items-center bg-black"
          >
            <WalletMultiButton />
            <EthConnectButton showDisconnect />
            <Link href={project?.externalUrl || "https://rightclickable.com"}>
              <a target={"_blank"} className="btn btn-ghost w-48">
                {project?.name || "back"}
              </a>
            </Link>
          </ul>
        </div>
      </section>
    </nav>
  );
};
