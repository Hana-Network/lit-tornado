import { defineConfig } from "@wagmi/cli";
import { hardhat, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "../frontend/src/contracts.ts",
  plugins: [
    hardhat({
      project: "../contracts",
    }),
    react(),
  ],
});
