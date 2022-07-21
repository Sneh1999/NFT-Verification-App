import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "@rainbow-me/rainbowkit/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [chain.mainnet],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "NFT Holder Verification App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
        <ToastContainer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
