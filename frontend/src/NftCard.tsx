import axios from 'axios';
import { Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import myNftJson from './MyNFT.json';

export default function NftCard({ nftIndex = 0 }) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const provider = ethers.providers.getDefaultProvider('ropsten');
    const nftContract = new Contract(process.env.CONTRACT_ADDRESS as string, myNftJson.abi, provider);
    nftContract
      .tokenURI(nftIndex)
      .then((value: any) => {
        console.log(value);
        axios.get(value).then((response) => {
          console.log(response.data);
          setData(response.data);
          setLoading(false);
        });
      })
      .catch((err: any) => console.log(err));
  }, [nftIndex]);

  console.log(loading);

  return (
    <div className="nft-card" style={{ width: '300px', height: '350px', marginRight: '10px' }}>
      {!loading && (
        <div>
          <img src={`https://ipfs.io/ipfs/${data.ipfs.path}`} alt="" loading="lazy" className="logo-image" />
          <div>
            <div>Name: {data.metadata.name}</div>
            <div>Author: {data.metadata.author}</div>
            <div>Description: {data.metadata.description}</div>
            <div>Class: {data.metadata.class}</div>
            <div>Type: {data.metadata.type}</div>
            <div>Score: {data.metadata.score}</div>
          </div>
        </div>
      )}
    </div>
  );
}
