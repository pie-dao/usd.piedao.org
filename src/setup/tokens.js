import BigNumber from 'bignumber.js';

import { eth } from '@pie-dao/eth';
import { ethers } from 'ethers';
import { mint } from '@pie-dao/mint';
import { pieSmartPool } from '@pie-dao/abis';

export const controllerAddress = '0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e'.toLowerCase();
export const DAIAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase();
export const sUSDAddress = '0x57ab1e02fee23774580c119740129eac7081e9d3'.toLowerCase();
export const poolAddress = '0x1Ee383389c621C37Ee5Aa476F88413A815083c5D'.toLowerCase();
export const TUSDAddress = '0x0000000000085d4780B73119b644AE5ecd22b376'.toLowerCase();
export const USDCAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase();

export const mintable = {
  address: controllerAddress,
  amountPerUnit: BigNumber(1),
  color: '#ffcd1c',
  symbol: 'USD++',
  weight: BigNumber(100),
};

const buildTokens = (mappedAmounts) => ({
  DAI: {
    address: DAIAddress,
    decimals: 18,
    amountPerUnit: BigNumber(mappedAmounts[DAIAddress]).dividedBy(10 ** 18),
    color: '#1caa98',
    symbol: 'DAI',
    weight: BigNumber(20.42),
  },
  sUSD: {
    address: sUSDAddress,
    decimals: 18,
    amountPerUnit: BigNumber(mappedAmounts[sUSDAddress]).dividedBy(10 ** 18),
    color: '#305cee',
    symbol: 'sUSD',
    weight: BigNumber(3.78),
  },
  TUSD: {
    address: TUSDAddress,
    decimals: 18,
    amountPerUnit: BigNumber(mappedAmounts[TUSDAddress]).dividedBy(10 ** 18),
    color: '#6f51fd',
    symbol: 'TUSD',
    weight: BigNumber(28.58),
  },
  USDC: {
    address: USDCAddress,
    decimals: 6,
    amountPerUnit: BigNumber(mappedAmounts[USDCAddress]).dividedBy(10 ** 6),
    color: '#d6099b',
    symbol: 'USDC',
    weight: BigNumber(47.22),
  },
});

const updateTokens = async ({ database }) => {
  try {
    const [
      DAIBalance,
      sUSDBalance,
      TUSDBalance,
      USDCBalance,
    ] = await Promise.all([
      database.balance({ address: poolAddress, token: DAIAddress }),
      database.balance({ address: poolAddress, token: sUSDAddress }),
      database.balance({ address: poolAddress, token: TUSDAddress }),
      database.balance({ address: poolAddress, token: USDCAddress }),
    ]);

    const totalSupply = DAIBalance.plus(sUSDBalance).plus(TUSDBalance).plus(USDCBalance);

    const DAIPercentage = DAIBalance.dividedBy(totalSupply);
    const sUSDPercentage = sUSDBalance.dividedBy(totalSupply);
    const TUSDPercentage = TUSDBalance.dividedBy(totalSupply);
    const USDCPercentage = USDCBalance.dividedBy(totalSupply);

    const DAIRequired = BigNumber(1).multipliedBy(DAIPercentage);
    const sUSDRequired = BigNumber(1).multipliedBy(sUSDPercentage);
    const TUSDRequired = BigNumber(1).multipliedBy(TUSDPercentage);
    const USDCRequired = BigNumber(1).multipliedBy(USDCPercentage);

    const updates = {
      DAI: {
        amountPerUnit: DAIRequired,
        weight: DAIPercentage.multipliedBy(100).dp(2),
      },
      sUSD: {
        amountPerUnit: sUSDRequired,
        weight: sUSDPercentage.multipliedBy(100).dp(2),
      },
      TUSD: {
        amountPerUnit: TUSDRequired,
        weight: TUSDPercentage.multipliedBy(100).dp(2),
      },
      USDC: {
        amountPerUnit: USDCRequired,
        weight: USDCPercentage.multipliedBy(100).dp(2),
      },
    };

    mint.updateTokens(updates);
  } catch (e) {
    console.error('TOKEN UPDATE ERROR', e);
  }
};

export const initialize = async ({ database }) => {
  const {
    approve,
    notify,
    signer,
    transactionOverrides,
  } = eth;

  // Load up pools target weights
  const controllerContract = new ethers.Contract(controllerAddress, pieSmartPool, signer);
  const poolAmount = ethers.utils.bigNumberify('1000000000000000000');
  const poolAmounts = await controllerContract.calcTokensForAmount(poolAmount);

  const mappedAmounts = {};
  poolAmounts[0].forEach((token, index) => {
    mappedAmounts[token.toLowerCase()] = poolAmounts[1][index].toString();
  });

  const tokens = buildTokens(mappedAmounts);

  console.log('TOKEN CONFIG', tokens);

  const submit = async () => {
    const amount = BigNumber(mint.slider).multipliedBy(10 ** 18);
    const joinAmount = ethers.utils.bigNumberify(amount.toFixed());
    const overrides = transactionOverrides({ gasLimit: 1000000 });

    await approve({ spender: controllerAddress, token: DAIAddress });
    await approve({ spender: controllerAddress, token: sUSDAddress });
    await approve({ spender: controllerAddress, token: TUSDAddress });
    await approve({ spender: controllerAddress, token: USDCAddress });

    notify(await controllerContract.joinPool(joinAmount, overrides));
  };

  if (!mint.initialized) {
    try {
      mint.init({
        approve,
        database,
        mintable,
        submit,
        tokens,
      });

      setInterval(() => { updateTokens({ database }); }, 10000);
      setTimeout(() => { updateTokens({ database }); }, 1000);
    } catch (e) {
      console.error('MINT INITIALIZING ERROR', e);
    }
  } else {
    // TODO: make this unnecessary
    window.location.reload();
  }
};
