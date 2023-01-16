import { useState, useEffect, useRef } from 'react'
import './App.css'
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json"

const getEthereumObject = () => window.ethereum;

/* 
  Find linked account. Found ? return first one : return null
*/

const findMetamaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    // check access to ethereum object
    if (!ethereum) {
      alert("No metamask found!");
    }

    console.log("We have Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account", account);
      return account;
    } else {
      console.error("No authorized accounts found");
      return null;
    }

  } catch (error) {
    console.error(error);
    return null;
  }
}

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [totalWaves, setTotalWaves] = useState(null);
  const [status, setStatus] = useState('Not connected');

  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = '0x9681Fc28d304821D3D53cFD054d948AC8A591fD5';
  const contractABI = abi.abi;

  const msgInputRef = useRef();

  


  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();

      if (!ethereum) {
        alert("This site requries metamask. Please download and install it");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  const wave = async () => {
    setStatus('loading')
    try {
      // get ethereum object
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    
        const waveTxn = await wavePortalContract.wave(msgInputRef.current.value);
        setStatus('Mining...')
        console.log("Mining ...", waveTxn);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn);
        setStatus('Mined')
        let count = await wavePortalContract.getTotalWaves();
        console.log("NEW Retrieved total wave count ...", count.toNumber());
        setTotalWaves(count.toNumber());

        let waves = await wavePortalContract.getAllWaves();
        console.log("all waves ->", waves);
        wavesParser(waves);

      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  const wavesParser = (_waves) => {
    let wavesCleaned = [];
    _waves.forEach(e => {
      wavesCleaned.push({
        address: e.waver,
        timestamp: new Date(e.timestamp * 1000),
        message: e.message
      })
    })
    setAllWaves(wavesCleaned);
  }

  const getTotalWaves = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
    const waves = await wavePortalContract.getAllWaves();
    wavesParser(waves);

    const count = await wavePortalContract.getTotalWaves();
    console.log("OLD retrieved total wave count ...", count.toNumber());
    setTotalWaves(count.toNumber());
  }

  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(() => {
    setStatus('loading')
    const getAccount = async () => await findMetamaskAccount();
    const account = getAccount();
    if (account !== null) {
      account.then(r => {
        setCurrentAccount(r);
      })
      getTotalWaves();
    }
    setStatus('Loaded')
  }, []);

  return (
    <div className="container mx-auto p-16 font-mono">
      <h1 className='text-slate-800 font-bold text-base mb-2'>Salom <span className='text-base font-mono font-normal text-sky-500'>{`${currentAccount ? currentAccount+'!' : '!'}`}</span></h1>

      {currentAccount && (
        <div className="flex flex-row space-x-4 mb-12">
          <p className='px-2 py-2 bg-green-100 text-green-800'>Connected</p>
          <p className="p-2 transform opacity-100">Total Waves: <span className='text-sky-500'>{totalWaves}</span></p>
          <p className="p-2 'opacity-100">Status: {status}</p>
        </div>
      )}
      {!currentAccount && (
        <button onClick={connectWallet} className="px-4 py-3 rounded-sm ring-1 ring-sky-500 hover:bg-sky-300">Connect Wallet</button>
      )}
      {currentAccount && (
        <div className="flex flex-col justify-start items-start space-y-6">
          <input type="text" name="" id="" ref={msgInputRef} required className='border border-slate-800 p-2' placeholder='Your message' />
          <button className="px-4 py-3 rounded-sm ring-1 ring-sky-500 hover:bg-sky-300" onClick={() => wave()}>
          Wave at Me!
        </button>
        </div>
      )}

      {currentAccount && (
        allWaves.map((wave, index) => {
          return (
            <div className="flex flex-col justify-start items-start mt-12 space-y-6 max-w-lg border border-red-400 p-3 " key={index}>
              <p className='text-xs'>From: <span className='bg-sky-100 text-sky-800 p-2'>{wave.address}</span> </p>
              <p>Time: {wave.timestamp.toString()}</p>
              <p>Message: {wave.message}</p>
            </div>
          )
        })
      )}

    
    </div>
  )
}

export default App
