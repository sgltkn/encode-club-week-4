/** usage:
 *  yarn run ts-node --files ./scripts/deploy.ts
 */

import { ethers } from "hardhat";
import "dotenv/config";
import * as myNFTJson from "../artifacts/contracts/ERC721.sol/MyNFT.json";

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

  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const NFTContractFactory = new ethers.ContractFactory(
    myNFTJson.abi,
    myNFTJson.bytecode,
    signer
  );

  let NFTContract = await NFTContractFactory.deploy();
  await NFTContract.deployed();
  console.log(`Contract deployed at ${NFTContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
