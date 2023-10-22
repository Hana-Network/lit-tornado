"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { Header } from "@/components/Header";
import { Main } from "@/components/Main";
import { Toaster } from "react-hot-toast";

const chains = [polygonMumbai];
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: "Lit🔥Tornado🌪",
  description:
    "a mixer app like Tornado Cash but using Lit Protocol - achieving confidential transactions without zero-knowledge proofs!",
  url: "https://github.com/Hana-Network/lit-tornado",
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
            <title>Lit🔥Tornado🌪</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header />
          <div className="flex-grow flex justify-center items-center ">
            <Main />
          </div>
        </WagmiConfig>
      ) : null}
    </div>
  );
}
