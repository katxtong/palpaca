const { ethers } = require("hardhat");
const dotenv = require("dotenv");
dotenv.config();
const hre = require("hardhat")
import { PalPaca__factory } from "../typechain-types";

function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_END_POINT ?? "");
    //const provider = ethers.getDefaultProvider("sepolia");
    return provider;
}

async function main() {
    const provider = setupProvider();
    const myPacksAddress = process.env.CONTRACT_ADDRESS;
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY ?? "", provider);

    const contract = new ethers.Contract(
        myPacksAddress,
        PalPaca__factory.abi,
        wallet
    );

    await contract.mint(7);
    console.log("Minted successfully.");
    // const [user] = await ethers.getSigners();
    // const MyPacks = await ethers.getContractFactory("PalPaca");
    // const myPacks = MyPacks.attach(myPacksAddress);

    // try {
    //     await myPacks.connect(user).mint(7);
    //     console.log("Minted successfully.");

    //     console.log("Minted by: ", user.address, "\n");
    // } catch (error) {
    //     console.error("Error opening pack:", error);
    // }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });