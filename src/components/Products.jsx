import PropTypes from 'prop-types';
import React from 'react';

import { view } from '@risingstack/react-easy-state';

const ProductCard = ({ name, products, url }) => {
  const { description, linkText } = products[name];

  const styles = {
    backgroundImage: `url(./assets/img/cards/${name}BG.png)`,
  };

  if (linkText === 'Coming soon') {
    styles.opacity = '50%';
  }

  const logoStyle = {
    backgroundImage: `url(./assets/img/cards/${name}Icon.png)`,
  };

  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <div className="product-card-container" style={styles}>
      <div className="logo" style={logoStyle} />
      <div className="title">
        {name}
      </div>
      <div className="description">
        {description}
      </div>
      <button
        className="btn"
        disabled={linkText === 'Coming soon'}
        onClick={handleClick}
        type="button"
      >
        {linkText}
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  products: PropTypes.shape({
    description: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const Products = (props) => {
  const { text: { products: { title }, products } } = props;
  return (
    <div className="products-container">
      <div className="content">
        <div className="title">
          {title}
        </div>

        <div className="cards">
          <ProductCard products={products} url="https://btc.piedao.org/#/liquidity" name="BTC++" />
          <ProductCard products={products} name="AWP++" />
          <ProductCard products={products} name="USD++" url="https://usd.piedao.org/#/liquidity" />
        </div>
      </div>
    </div>
  );
};

Products.propTypes = {
  text: PropTypes.shape({
    products: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default view(Products);
