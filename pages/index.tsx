import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, Contract } from "ethers";
import { isAddress } from "ethers/lib/utils";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { ERC721_ABI } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const zero = BigNumber.from("0");

  /** WAGMI Hooks and State variables */
  const [holderEmoji, setHolderEmoji] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>("");

  // Keeps in check the Hydration error of React 18 (https://github.com/vercel/next.js/discussions/35773)
  const isMounted = useIsMounted();

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

  /**
   * Sets the emoji back to an empty state
   * when the address is switched or an unsupported chain is
   * connected.
   */
  useEffect(() => {
    if (address || chain?.unsupported) setHolderEmoji("");
  }, [address, chain]);

  /**
   * Checks if the given address holds the NFT for a valid
   * ERC721 contract address
   */
  const checkIfHolder = async () => {
    try {
      setIsLoading(true);
      // Verifies if the string provided is an ethereum address
      if (!isAddress(contractAddress)) throw new Error("Invalid address");
      // creates an instance of ethers contract
      let contract = new Contract(contractAddress, ERC721_ABI, provider);
      // checks the balance of NFT's held by a given address for the provided
      // contract address
      let currentValue = await contract.balanceOf(address);
      if (currentValue.gt(zero)) {
        setHolderEmoji("💎");
      } else {
        setHolderEmoji("🤲");
      }
    } catch (e) {
      toast.error("Provide a valid ERC721 address");
      setHolderEmoji("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Holder Verification App</title>
        <meta name="description" content="NFT Holder Verification App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.description}>
          Welcome to NFT Holder Verification App
        </h1>
        <ConnectButton />
        <div>
          {isMounted && isConnected && !chain?.unsupported && (
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
              <div className={styles.emoji}>{holderEmoji}</div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
