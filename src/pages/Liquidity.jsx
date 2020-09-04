import React from 'react';

// import { eth } from '@pie-dao/eth';
// import { Mint } from '@pie-dao/mint';
import { view } from '@risingstack/react-easy-state';

// import PoolBalance from '../components/PoolBalance';

const Liquidity = () => {
  const url = 'https://pools.piedao.org/#/pools/0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e';
  window.location.href = url;

  /*
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
  */
  return (
    <center>
      Redirecting to
      <br />
      <a href={url}>{url}</a>
    </center>
  );
};

export default view(Liquidity);
