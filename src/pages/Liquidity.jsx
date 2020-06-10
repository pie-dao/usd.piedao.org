import React from 'react';

import { eth } from '@pie-dao/eth';
import { Mint } from '@pie-dao/mint';
import { view } from '@risingstack/react-easy-state';

import PoolBalance from '../components/PoolBalance';

const Liquidity = (props) => {
  if (eth.account) {
    return (
      <div className="liquidity-container content">
        <PoolBalance {...props} />
        <Mint {...props} />
      </div>
    );
  }

  return (
    <div className="liquidity-container content">
      Please connect Metamask
    </div>
  );
};

export default view(Liquidity);
