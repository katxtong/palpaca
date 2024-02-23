//deployed to 0x9d7A1d1124b74eEBbB9b0EDf0757423800ee670B
// i spent 0.0923 eth to deploy :|
// that's $290

const hre = require("hardhat")
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

    const hre = require("hardhat");

    const [deployer] = await hre.ethers.getSigners();
    const MyPacks = await hre.ethers.getContractFactory("PalPaca");
    const URI: string = process.env.URI || "";
    const myPacks = await MyPacks.deploy(URI);
    await myPacks.waitForDeployment();
    const address = await myPacks.getAddress();
    console.log(`Contract deployed to the address ${address}`);

    // Mint tokens using the mint function in the contract
    const tokenAmountToMint = 7;
    await myPacks.mint(tokenAmountToMint);
    console.log(`Minted ${tokenAmountToMint} nfts successfully.`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
