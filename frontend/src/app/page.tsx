"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig, useAccount } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { Header } from "@/components/Header";
import { Main } from "@/components/Main";
import { Toaster } from "react-hot-toast";

const chains = [polygonMumbai];
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: "Next Starter Template",
  description: "A Next.js starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: polygonMumbai,
  themeMode: "light",
});

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Toaster position="top-right" />
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <Head>
            <title>Tornado Cash Classic UI Replica</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header />
          <div className="flex-grow flex justify-center items-center mt-[-5rem]">
            <Main />
          </div>
        </WagmiConfig>
      ) : null}
    </div>
  );
}
