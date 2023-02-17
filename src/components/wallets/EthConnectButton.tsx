import { useWeb3React } from "@web3-react/core";
import { FC } from "react";
import { toast } from "react-toastify";
import { ERROR_MESSAGES, injected, shortenAddress } from "utils";
import { MetamaskIMG } from "./MetamaskIMG";

interface EthConnectButtonProps {
  showDisconnect?: boolean;
}

export const EthConnectButton: FC<EthConnectButtonProps> = ({
  showDisconnect,
}) => {
  const { active, account, activate, deactivate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (e) {
      console.error(e);
      toast.error(ERROR_MESSAGES.WALLET_CONNECTION_FAILED);
    }
  };

  const disconnect = async () => {
    try {
      deactivate();
    } catch (e) {
      console.error(e);
      toast.error(ERROR_MESSAGES.WALLET_CONNECTION_FAILED);
    }
  };

  return (
    <>
      {!active && (
        <button onClick={connect} className="btn btn-ghost w-48">
          <MetamaskIMG />
          <span className="ml-2">Connect</span>
        </button>
      )}
      {active && account && showDisconnect && (
        <button onClick={disconnect} className="btn btn-ghost w-48">
          <MetamaskIMG />
          <span className="ml-2">{shortenAddress(account)}</span>
        </button>
      )}
    </>
  );
};
