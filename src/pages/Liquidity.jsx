import React from 'react';

import { eth } from '@pie-dao/eth';
import { Mint } from '@pie-dao/mint';
import { view } from '@risingstack/react-easy-state';

import PoolBalance from '../components/PoolBalance';

const handleClick = () => {
  window.location.href = 'https://uniswap.exchange/swap?'
    + 'outputCurrency=0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e';
};

const handleClickBalancer = () => {
  window.location.href = 'https://balancer.exchange/#'
    + '/swap/ether/0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e';
};

const Liquidity = (props) => {
  if (eth.account) {
    return (
      <div className="liquidity-container content">
        <Mint {...props} />
        <PoolBalance {...props} />
        <button className="btn" type="button" onClick={handleClick}>
          or get USD++ on Uniswap
        </button>
        <button className="btn" type="button" onClick={handleClickBalancer}>
          or get USD++ on Balancer
        </button>
      </div>
    );
  }

  return (
    <div className="liquidity-container content">
      <button className="btn" type="button" onClick={handleClick}>Get USD++ on Uniswap</button>
      <button className="btn" type="button" onClick={handleClickBalancer}>Get USD++ on Balancer</button>
    </div>
  );
};

export default view(Liquidity);
