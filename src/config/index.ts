export const config = {
  candyMachineId: process.env.NEXT_PUBLIC_CANDY_MACHINE_ID || "",
  solanaNetwork: process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet",
  rpcUrl:
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/",
  cmsBaseUrl:
    process.env.NEXT_PUBLIC_CMS_API || "https://cms.rightclickable.com/api",
};
