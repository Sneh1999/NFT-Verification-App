import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { ERC721_ABI } from "../constants";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [isHolder, setIsHolder] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>("");
  const zero = BigNumber.from("0");
  const provider = ethers.getDefaultProvider();

  const verify = async () => {
    try {
      let contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
      let currentValue = await contract.balanceOf(address);
      if (currentValue > zero) {
        setIsHolder(true);
      } else {
        setIsHolder(false);
      }
    } catch (e) {
      console.log(e);
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
        {isConnected ? (
          <div>
            <input
              type="text"
              placeholder="Address of the NFT Collection"
              onChange={async (e) => {
                setContractAddress(e.target.value || "");
              }}
              className={styles.input}
            />
            <button className={styles.button} onClick={verify}>
              Verify!
            </button>
            {isHolder ? <div>holder</div> : <div>not holder</div>}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Home;
