import { Contract, ethers } from 'ethers';
import React from 'react';
import './App.css';
import NftCard from './NftCard';

function App() {
  const nftCards = () => {
    const nftCardList = Array<React.ReactElement>();
    for (let i = 0; i < 10; i++) {
      nftCardList.push(<NftCard nftIndex={i} />);
    }
    return nftCardList;
  };

  return (
    <div className="App">
      <header className="App-header">NFT LIST</header>
      <div className="nft-cards">{nftCards()}</div>
    </div>
  );
}

export default App;
