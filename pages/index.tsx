import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { ERC721_ABI } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [isHolder, setIsHolder] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>("");
  const isMounted = useIsMounted();
  const zero = BigNumber.from("0");
  const provider = useProvider();

  useEffect(() => {
    if (address || chain?.unsupported) setIsHolder("");
  }, [address, chain]);

  const checkIfHolder = async () => {
    try {
      setIsLoading(true);
      if (!isAddress(contractAddress)) throw new Error("Invalid address");
      let contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
      let currentValue = await contract.balanceOf(address);
      if (currentValue.gt(zero)) {
        setIsHolder("💎");
      } else {
        setIsHolder("🤲");
      }
    } catch (e) {
      toast.error("Provide a valid ERC721 address");
      setIsHolder("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Welcome to NFT Holder Verification App</title>
        <meta name="description" content="NFT Holder Verification App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.description}>
          Welcome to NFT Holder Verification App
        </h1>
        <ConnectButton />
        <div>
          {isMounted && isConnected && !chain?.unsupported ? (
            <>
              <div className={styles.form}>
                <input
                  type="text"
                  placeholder="Address of the NFT Collection"
                  onChange={(e) => {
                    setContractAddress(e.target.value || "");
                  }}
                  className={styles.input}
                />
                <button className={styles.button} onClick={checkIfHolder}>
                  {isLoading ? "Loading..." : "Verify!"}
                </button>
                <ToastContainer />
              </div>
              <div className={styles.emoji}>{isHolder}</div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Home;
