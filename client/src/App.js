import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './App.css';

const Products = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleAddToCart = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product.id]) {
      updatedCart[product.id] += 1;
    } else {
      updatedCart[product.id] = 1;
    }
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = { ...cart };
    delete updatedCart[productId];
    setCart(updatedCart);
  };

  return (
    <div className="products">
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Available</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleAddToCart(product)} disabled={product.amount === 0}>
                Add to Cart
              </button>
              <button onClick={() => handleRemoveFromCart(product.id)}>Remove from Cart</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Products.propTypes = {
  cart: PropTypes.object.isRequired,
  setCart: PropTypes.func.isRequired,
};

const Cart = ({ cart, setCart, userBalance, setUserBalance, products }) => {
  const [message, setMessage] = useState('');

  const handlePayment = () => {
    const totalAmount = Object.keys(cart).reduce((total, productId) => {
      const product = products.find(p => p.id === parseInt(productId));
      return total + cart[productId] * product.price;
    }, 0);

    if (totalAmount > userBalance) {
      setMessage('Insufficient balance');
    } else {
      setMessage('Payment successful!');
      const newBalance = userBalance - totalAmount;
      setUserBalance(newBalance);
      setCart({});
    }
  };

  return (
    <div className="products">
      <h2>Cart</h2>
      <ul>
        {Object.keys(cart).map(productId => (
          <li key={productId}>
            <div className="product-info">
              <h3>Product ID: {productId}</h3>
              <p>Quantity: {cart[productId]}</p>
            </div>
          </li>
        ))}
      </ul>
      <p>User Balance: ${userBalance}</p>
      <button className="blue-button" onClick={handlePayment}>Proceed to Payment</button>
      {message && <p>{message}</p>}
    </div>
  );
};

Cart.propTypes = {
  cart: PropTypes.object.isRequired,
  setCart: PropTypes.func.isRequired,
  userBalance: PropTypes.number.isRequired,
  setUserBalance: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

const App = () => {
  const [cart, setCart] = useState({});
  const [userBalance, setUserBalance] = useState(1000);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="app">
      <Products cart={cart} setCart={setCart} />
      <Cart cart={cart} setCart={setCart} userBalance={userBalance} setUserBalance={setUserBalance} products={products} />
    </div>
  );
};

export default App;
