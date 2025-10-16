import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartContainer = styled.div`
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const CartContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const CartTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  background-color: #1a1a1a;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #888;
    margin-bottom: 1rem;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  button {
    background-color: #333;
    color: #fff;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #444;
    }

    &:disabled {
      background-color: #222;
      cursor: not-allowed;
    }
  }
`;

const ItemTotal = styled.div`
  text-align: right;

  p {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    margin-top: 1rem;
  }
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: #ff4444;
  border: 1px solid #ff4444;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #ff4444;
    color: #fff;
  }
`;

const CartSummary = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;

  &.total {
    font-size: 1.25rem;
    font-weight: bold;
    border-bottom: none;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background-color: #ddd;
  }

  &:disabled {
    background-color: #333;
    color: #666;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 2rem;

  p {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

const ContinueShopping = styled(Link)`
  background-color: #fff;
  color: #000;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    background-color: #ddd;
  }
`;

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, isAuthenticated } = useCart();

  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <CartContainer>
        <CartContent>
          <CartTitle>YOUR CART</CartTitle>
          <EmptyCart>
            <p>Your cart is empty</p>
            <ContinueShopping to="/store">Continue Shopping</ContinueShopping>
          </EmptyCart>
        </CartContent>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartContent>
        <CartTitle>YOUR CART</CartTitle>

        <CartItems>
          {items.map((item) => (
            <CartItem key={item._id}>
              <ItemImage>
                <img src={item.imageUrl} alt={item.title} />
              </ItemImage>
              <ItemDetails>
                <h3>{item.title}</h3>
                <p>{item.type}</p>
                <p>₹{item.price} each</p>
                <QuantityControls>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= 10}
                  >
                    +
                  </button>
                </QuantityControls>
              </ItemDetails>
              <ItemTotal>
                <p>₹{item.price * item.quantity}</p>
                <RemoveButton onClick={() => removeFromCart(item._id)}>× Remove</RemoveButton>
              </ItemTotal>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <SummaryRow>
            <span>Subtotal</span>
            <span>₹{total}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping</span>
            <span>Free</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Total</span>
            <span>₹{total}</span>
          </SummaryRow>
          <CheckoutButton disabled={!isAuthenticated}>
            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
          </CheckoutButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;