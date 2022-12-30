import { useState, useEffect } from 'react'
import './App.css'

const getEthereumObject = () => window.ethereum;

/* 
  Find linked account. Found ? return first one : return null
*/

const findMetamaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    // check access to ethereum object
    if (!ethereum) {
      console.error("No metamask found!");
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

  const [currentAccount, setCurrentAccount] = useState("");

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

  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(() => {
    const getAccount = async () => await findMetamaskAccount();
    const account = getAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className='text-slate-800 font-bold text-3xl mb-2'>Salom!</h1>

      {!currentAccount && (
        <button onClick={connectWallet} className="px-4 py-3 rounded-sm ring-1 ring-sky-500">Connect Wallet</button>
      )}
    </div>
  )
}

export default App
