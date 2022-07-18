/** usage:
 *  yarn run ts-node --files ./scripts/mintTokens.ts
 */

import { ethers } from "hardhat";
import "dotenv/config";
import { MyNFT } from "../typechain";

function setupProvider() {
  const infuraOptions = process.env.INFURA_API_KEY
    ? process.env.INFURA_API_SECRET
      ? {
          projectId: process.env.INFURA_API_KEY,
          projectSecret: process.env.INFURA_API_SECRET,
        }
      : process.env.INFURA_API_KEY
    : "";
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: infuraOptions,
  };
  const provider = ethers.providers.getDefaultProvider("ropsten", options);
  return provider;
}

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC, `m/44'/60'/0'/0/0`)
      : new ethers.Wallet(process.env.PRIVATE_KEY as string);
  console.log(`Using address ${wallet.address}`);

  const provider = setupProvider();
  const signer = wallet.connect(provider);

  const NFTContractFactory = await ethers.getContractFactory("MyNFT");
  const NFTContract: MyNFT = NFTContractFactory.attach(
    process.env.CONTRACT_ADDRESS as string
  );

  let tx;
  for (let i = 0; i < 10; i++) {
    tx = await NFTContract.connect(signer).safeMint(signer.address);
    console.log(`Transaction hash for NFT-${i}: ${tx.hash}`);

    console.log(
      `tokenURI for respective NFT is: ${await NFTContract.connect(
        signer
      ).tokenURI(i)}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
