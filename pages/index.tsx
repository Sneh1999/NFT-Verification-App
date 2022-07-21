import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useProvider } from "wagmi";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { ERC721_ABI } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import { isAddress } from "ethers/lib/utils";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [isHolder, setIsHolder] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>("");
  const isMounted = useIsMounted();
  const zero = BigNumber.from("0");
  const provider = useProvider();

  useEffect(() => {
    if (address) setIsHolder("");
  }, [address]);

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
      console.log(e);
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
          {isMounted && isConnected ? (
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
              </div>
              {isHolder}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Home;
