import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

// import artifacts
import bankArtifact from './artifacts/contracts/Bank.sol/Bank.json';
import maticArtifact from './artifacts/contracts/Matic.sol/Matic.json';
import shibArtifact from './artifacts/contracts/Shib.sol/Shib.json';
import usdtArtifact from './artifacts/contracts/Usdt.sol/Usdt.json';

function App() {
  // interacts with the blockchain
  const [proivder, setProvider] = useState(undefined);
  // interact with blockchain as a user
  const [signer, setSigner] = useState(undefined);
  // wallet interacting with dapp
  const [signerAddress, setSignerAddress] = useState(undefined);
  // bank contract
  const [bankContract, setBankContract] = useState(undefined);
  // token contracts
  const [tokenContracts, setTokenContracts] = useState({});
  // how much logged in wallet has in each of the tokens
  const [tokenBalances, setTokenBalances] = useState({});
  // symbols of each tokne
  const [tokenSymbols, setTokenSymbols] = useState([]);

  const [amount, setAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [isDeposit, setIsDeposit] = useState(true);

  // helper functions
  const toBytes32 = (text) => ethers.utils.formatBytes32String(text);
  const toString = (bytes32) => ethers.utils.parseBytes32String(bytes32);
  const toWei = (ether) => ethers.utils.parseEther(ether);
  const toEther = (wei) => ethers.utils.formatEther(wei).toString();
  const toRound = (num) => Number(num).toFixed(2);

  // connect to metamask
  useEffect(() => {
    const init = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const bankContract = await new ethers.Contract(
        process.env.REACT_APP_BANK_CONTRACT_ADDRESS,
        bankArtifact.abi
      );

      setBankContract(bankContract);

      // interact with blockchain as provider
      bankContract
        .connect(provider)
        .getWhitelistedSymbols()
        .then((result) => {
          // get symbols
          const symbols = result.map((s) => toString(s));
          setTokenSymbols(symbols);
          // get token contracts
          getTokenContracts(symbols, bankContract, provider);
        });
    };
    init();
  }, []);

  const getTokenContract = async (symbol, bankContract, provider) => {
    const address = await bankContract
      .connect(provider)
      .getWhitelistedTokenAddress(toBytes32(symbol));
    const abi =
      symbol === 'Matic'
        ? maticArtifact.abi
        : symbol === 'Shib'
        ? shibArtifact.abi
        : usdtArtifact.abi;
    const tokenContract = new ethers.Contract(address, abi);
    return tokenContract;
  };

  const getTokenContracts = async (symbols, bankContract, provider) => {
    symbols.map(async (symbol) => {
      const contract = await getTokenContract;
      symbol, bankContract, provider;
      setTokenContracts((prev) => ({ ...prev, [symbol]: contract }));
    });
  };

  const isConnected = () => signer !== undefined;

  return (
    <div className='App'>
      <header className='App-header'>
        {isConnected() ? (
          <div>
            <p>Welcome {signerAddress?.substring(0, 10)}...</p>
          </div>
        ) : (
          <div>
            <p>You are not connected</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
