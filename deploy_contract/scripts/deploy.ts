// import { ethers } from "hardhat";
const hre = require("hardhat")
import * as dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import { PalPaca__factory } from "../typechain-types";

function setupProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_END_POINT ?? "");
  //const provider = ethers.getDefaultProvider("sepolia");
  return provider;
}

async function main() {
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY ?? "", provider);
  const URI: string = process.env.URI || "";

  const palpacaFactory = new PalPaca__factory(wallet);
  const palpacaContract = await palpacaFactory.deploy(URI);

  await palpacaContract.waitForDeployment();
  const address = await palpacaContract.getAddress();
  console.log(`Contract deployed to the address ${address}`);
}
// async function main() {

//   const PalPaca = await ethers.getContractFactory("PalPaca");
//   const URI: string = process.env.URI || ""; // Provide a default value or handle this according to your use case
//   const [owner] = await hre.ethers.getSigners();

//   const myPalPaca = await PalPaca.deploy(URI);
//   await myPalPaca.waitForDeployment();
//   const address = await myPalPaca.getAddress();

//   console.log(`PalPaca contract deployed to the address ${address}`);

//   console.log("Contract deployed by: ", owner.address, "\n");
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// second is 12am ipfs://
// third is 12am gateway url pasted

// 4th is 11pm ipfs://
// 5th is 11pm gateway url
