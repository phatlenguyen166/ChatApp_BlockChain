import React, { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
import { BrowserProvider, Contract } from 'ethers';
import MyContractABI from './MyContract.json'; // Import ABI
import { Register } from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
    return (
        <Login/>
        // <Home/>
    );
}

export default App;
