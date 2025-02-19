import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/Wallet.css';

const Wallet = () => {
  const wallet = useSelector((state) => state.wallet.assets);

  const calculateTotalValue = () => {
    return Object.values(wallet)
      .reduce(
        (total, asset) => total + asset.amount * parseFloat(asset.priceUsd),
        0
      )
      .toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  };

  return (
    <div className="wallet-container">
      <h2>My Wallet</h2>
      <p>Total Value: ${calculateTotalValue()}</p>
      <ul className="wallet-list">
        {Object.keys(wallet).length === 0 ? (
          <p>No assets in wallet</p>
        ) : (
          Object.values(wallet).map((asset) => (
            <li key={asset.symbol} className="wallet-item">
              <span>
                {asset.name} ({asset.symbol})
              </span>
              <span>
                {asset.amount.toFixed(4)} {asset.symbol} = $
                {(asset.amount * parseFloat(asset.priceUsd)).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Wallet;
