import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets } from '../redux/assetSlice';
import { Link } from 'react-router-dom';
import '../styles/AssetList.css';

const AssetList = () => {
  const dispatch = useDispatch();
  const { assets, status } = useSelector((state) => state.assets);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('marketCapUsd');

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const formatNumber = (num, decimals = 2) => {
    if (!num) return '-';
    return parseFloat(num).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const filteredAssets = assets
    .filter(
      (asset) =>
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy]));

  return (
    <div className="asset-list-container">
      {/* Search and Filter Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for an asset"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
          className="filter-dropdown"
        >
          <option value="marketCapUsd">Market Cap</option>
          <option value="priceUsd">Price</option>
          <option value="volumeUsd24Hr">24H Volume</option>
        </select>
      </div>

      {status === 'loading' ? (
        <p>Loading...</p>
      ) : (
        <ul className="asset-list">
          {filteredAssets.map((asset) => (
            <li key={asset.id} className="asset-item">
              <Link to={`/asset/${asset.id}`} className="asset-link">
                <span className="asset-symbol">{asset.symbol}</span>
                {asset.name}
              </Link>
              <span className="asset-price">
                ${formatNumber(asset.priceUsd)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssetList;
