import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { addAsset, removeAsset } from '../redux/walletSlice';
import '../styles/AssetDetail.css';

const AssetDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState('1M');
  const [amount, setAmount] = useState('');

  const wallet = useSelector((state) => state.wallet.assets);
  const userBalance = wallet[id]?.amount || 0;
  const balanceValue = userBalance * parseFloat(asset?.priceUsd || 0);

  const filterByTimeRange = (data, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case '5D':
        startDate = new Date(now.setDate(now.getDate() - 5));
        break;
      case '1M':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '6M':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case 'YTD':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case '1Y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return data;
    }

    let filteredData = data.filter(
      (point) => new Date(point.time) >= startDate
    );

    const todayPrice = {
      time: Date.now(),
      priceUsd:
        asset?.priceUsd || filteredData[filteredData.length - 1]?.priceUsd,
    };

    return [...filteredData, todayPrice];
  };

  useEffect(() => {
    axios.get(`https://api.coincap.io/v2/assets/${id}`).then((res) => {
      setAsset(res.data.data);
    });

    axios
      .get(`https://api.coincap.io/v2/assets/${id}/history?interval=d1`)
      .then((res) => {
        const allData = res.data.data;
        setHistory(filterByTimeRange(allData, timeRange));
      });
  }, [id, timeRange]);

  if (!asset || history.length === 0) return <p>Loading...</p>;

  const validPrices = history
    .map((point) => parseFloat(point.priceUsd))
    .filter((price) => !isNaN(price));
  const minPrice = Math.min(...validPrices) * 0.95;
  const maxPrice = Math.max(...validPrices) * 1.05;

  const handleAddToWallet = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    dispatch(
      addAsset({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        priceUsd: asset.priceUsd,
        amount: parseFloat(amount),
      })
    );
    setAmount('');
  };

  const handleRemoveFromWallet = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    dispatch(
      removeAsset({
        id: asset.id,
        amount: parseFloat(amount),
      })
    );
    setAmount('');
  };

  return (
    <div className="asset-detail-container">
      <div className="asset-header">
        <div className="asset-info">
          <h1>
            {asset.name} ({asset.symbol})
          </h1>
          <p>
            <strong>Current Price:</strong> $
            {parseFloat(asset.priceUsd).toLocaleString()}
          </p>
          <p>
            <strong>Market Cap:</strong> $
            {parseFloat(asset.marketCapUsd).toLocaleString()}
          </p>
          <p>
            <strong>24H Volume:</strong> $
            {parseFloat(asset.volumeUsd24Hr).toLocaleString()}
          </p>
        </div>
        <div className="wallet-section">
          <h3>Your Balance</h3>
          <p>
            {userBalance.toFixed(4)} {asset.symbol} (~$
            {balanceValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            )
          </p>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="wallet-buttons">
            <button className="wallet-button add" onClick={handleAddToWallet}>
              Add
            </button>
            <button
              className="wallet-button remove"
              onClick={handleRemoveFromWallet}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="time-range-buttons">
        {['5D', '1M', '6M', 'YTD', '1Y'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={timeRange === range ? 'active' : ''}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={history}>
            <XAxis
              dataKey="time"
              tickFormatter={(time) => new Date(time).toLocaleDateString()}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value, name) => [
                `$${parseFloat(value).toFixed(2)}`,
                name,
              ]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="priceUsd"
              stroke="#4CAF50"
              fill="rgba(76, 175, 80, 0.3)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetDetail;
