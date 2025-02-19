import walletReducer, { addAsset, removeAsset } from '../walletSlice';

describe('walletSlice reducer', () => {
  it('should add an asset to the wallet', () => {
    const initialState = { assets: {} };
    const action = addAsset({
      id: 'bitcoin',
      amount: 1.5,
      priceUsd: '50000',
      name: 'Bitcoin',
      symbol: 'BTC',
    });
    const newState = walletReducer(initialState, action);

    expect(newState.assets.bitcoin).toEqual({
      id: 'bitcoin',
      amount: 1.5,
      priceUsd: '50000',
      name: 'Bitcoin',
      symbol: 'BTC',
    });
  });

  it('should remove an asset from the wallet', () => {
    const initialState = {
      assets: { bitcoin: { id: 'bitcoin', amount: 1.5, priceUsd: '50000' } },
    };
    const action = removeAsset({ id: 'bitcoin', amount: 0.5 });
    const newState = walletReducer(initialState, action);

    expect(newState.assets.bitcoin.amount).toBe(1.0);
  });
});
