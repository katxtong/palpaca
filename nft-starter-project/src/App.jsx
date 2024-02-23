import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import openseaLogo from './assets/opensea-logo.svg';
import { ethers } from "ethers";
import PalPaca from './utils/PalPaca.json';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/PalPacaNFT`;
const OPENSEA_LINK = 'https://opensea.io/collection/palpaca';
const BLUR_LINK = 'https://testnets.opensea.io/account';
const TOTAL_MINT_COUNT = 1000;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mintQuantity, setMintQuantity] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  }


  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x9d7A1d1124b74eEBbB9b0EDf0757423800ee670B";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, PalPaca.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mint(mintQuantity);

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleMintQuantityChange = (event) => {
    // Ensure the quantity is a positive integer
    const newQuantity = Math.max(1, Math.floor(Number(event.target.value)));

    // Update the state with the new quantity
    setMintQuantity(newQuantity);
  }

  const decrementMintQuantity = () => {
    setMintQuantity(Math.max(1, mintQuantity - 1));
  }

  const incrementMintQuantity = () => {
    setMintQuantity(mintQuantity + 1);
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const curTotalSupply = async () => {
    const CONTRACT_ADDRESS = "0x9d7A1d1124b74eEBbB9b0EDf0757423800ee670B"; // "0x6d5E6a718b92D45A0efB0eF804365157Ac61779d";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, PalPaca.abi, signer);

        console.log("Grabbing total supply");
        const supply = await connectedContract.totalSupply();
        setTotalSupply(supply.toNumber());

        return totalSupply;
      } else {
        console.log("Ethereum object doesn't exist!");
        return 0; // Return a default value or handle the absence of Ethereum object
      }
    } catch (error) {
      console.log(error);
      return 0; // Return a default value or handle the error
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    curTotalSupply(); // Fetch the initial total supply

    // Fetch the total supply every 10 seconds (adjust this interval as needed)
    const totalSupplyInterval = setInterval(curTotalSupply, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(totalSupplyInterval);
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
  */
  return (
    <div className="App">
      <div className="container">
        <img alt="header" src="/crystal cave.gif" style={{ maxWidth: "100%" }} />
        <div className="header-container">
          <p className="header gradient-text">PalPaca</p>
          <p className="sub-text2 gradient-text">
            {totalSupply} / {TOTAL_MINT_COUNT} Minted
          </p>
          <img alt="palpaca" src="/img.png" style={{ maxWidth: "40%" }} />
          <p className="sub-text">
            Alpacas can't live in solitude. Neither can we. Come be our pals.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <div>
              <div className="quantity-control">
                <button onClick={decrementMintQuantity} className="quantity-button">-</button>
                <input className="quantity-input"
                  type="number"
                  value={mintQuantity}
                  onChange={handleMintQuantityChange}
                  min="1"
                />
                <button onClick={incrementMintQuantity} className="quantity-button">+</button>
              </div>
              <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                Mint
              </button>
            </div>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@PalPaca`}</a>

          <div style={{ marginLeft: '20px' }}></div> {/* Add space here */}

          <img alt="Opensea Logo" className="opensea-logo" src={openseaLogo} style={{
            maxWidth: "24px"
          }} />
          <div style={{ marginLeft: '10px' }}></div> {/* Add space here */}

          <a
            className="footer-text"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`OpenSea`}</a>
        </div >
        <div><p className="gradient-text footer-text2">Built by katxtong.eth</p></div>
        {/* <img alt="Blur Logo" className="blur-logo" src={blurLogo} />
          <a
            className="footer-text"
            href={BLUR_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Blur`}</a> */}

      </div >
    </div >
  );
};

export default App;
