import { resolveNetwork, getOrCreateSeed } from '../src/network.js';
import { createWallet } from '../src/wallet.js';

async function main() {
  const { network, config } = resolveNetwork();
  const seed = getOrCreateSeed(network);
  console.log(`Deriving address for network: ${network}...`);
  const ctx = await createWallet({ network, networkConfig: config, seed });
  const address = ctx.unshieldedKeystore.getBech32Address().toString();
  console.log(`\n======================================================`);
  console.log(`Network:        ${network}`);
  console.log(`Wallet Address: ${address}`);
  if (config.faucet) {
    console.log(`Faucet URL:     ${config.faucet}`);
  }
  console.log(`======================================================\n`);
  await ctx.wallet.stop();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
