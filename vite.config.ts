import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.NEXT_PUBLIC_CHAIN_ID': JSON.stringify('11155111'),
    'process.env.NEXT_PUBLIC_RPC_URL': JSON.stringify('https://sepolia.infura.io/v3/YOUR_INFURA_KEY'),
    'process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID': JSON.stringify('YOUR_WALLET_CONNECT_ID'),
    'process.env.NEXT_PUBLIC_INFURA_API_KEY': JSON.stringify('YOUR_INFURA_KEY'),
  },
}));
