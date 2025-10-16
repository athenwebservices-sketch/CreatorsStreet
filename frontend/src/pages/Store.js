import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styled, { keyframes } from 'styled-components';

const StoreContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #000000;
  min-height: 100vh;
`;

const StoreHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: #ffffff;
`;

const StoreTitle = styled.h1`
  font-size: 2.5rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const LoadingSpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
  margin: 2rem 0;
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const ProductCard = styled.div`
  background-color: #000000;
  border: 1px solid #ffffff;
  border-radius: 9px;
  width: 288px;
  height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const ProductImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: ${props => {
    switch(props.status) {
      case 'in_stock': return '#4CAF50';
      case 'out_of_stock': return '#f44336';
      case 'coming_soon': return '#FFA500';
      default: return '#888';
    }
  }};
`;

const ProductInfo = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const ProductTitle = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.2;
`;

const ProductType = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin: 10px 0;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #888;
  margin-right: 8px;
`;

const DiscountedPrice = styled.span`
  font-weight: bold;
  color: #e53935;
`;

const ProductActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 32px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #ffffff;
    color: #000000;
  }
`;

const BuyNowButton = styled(ActionButton)`
  background: #ffffff;
  color: #000000;

  &:hover {
    background: #f0f0f0;
    border-color: #f0f0f0;
  }
`;

const DisabledButton = styled(ActionButton)`
  border: 1px solid #666666;
  color: #666666;
  cursor: not-allowed;
  border-radius: 18px;
  height: 36px;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  color: #000000;
`;

const Store = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock async product fetch
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const mockProducts = [
          { id:1, name:'Premium Laptop', type:'Electronics', price:999, imageUrl:'https://via.placeholder.com/300', status:'in_stock' },
          { id:2, name:'Wireless Headphones', type:'Audio', price:199, imageUrl:'https://via.placeholder.com/300', status:'out_of_stock' },
          { id:3, name:'Smart Watch', type:'Wearables', price:299, imageUrl:'https://via.placeholder.com/300', status:'coming_soon' },
        ];
        await new Promise(res => setTimeout(res, 1000)); // simulate loading
        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if(product.status !== 'in_stock') return;
    addToCart(product);
    alert('Added to cart');
  };

  const handleBuyNow = (product) => {
    if(product.status !== 'in_stock') return;
    addToCart(product);
    navigate('/checkout');
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300';
  };

  return (
    <StoreContainer>
      <StoreHeader>
        <StoreTitle>OUR PRODUCTS</StoreTitle>
      </StoreHeader>

      {loading && (
        <LoadingSpinnerWrapper>
          <Spinner />
        </LoadingSpinnerWrapper>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <NoProducts>No products available at the moment.</NoProducts>
          ) : (
            <ProductsGrid>
              {products.map(product => (
                <ProductCard key={product.id}>
                  <ProductImage>
                    <ProductImg src={product.imageUrl} alt={product.name} onError={handleImageError} />
                    <StatusBadge status={product.status}>
                      {product.status === 'in_stock' ? 'In Stock' : product.status === 'out_of_stock' ? 'Out of Stock' : 'Coming Soon'}
                    </StatusBadge>
                  </ProductImage>
                  <ProductInfo>
                    <ProductTitle>{product.name}</ProductTitle>
                    <ProductType>{product.type}</ProductType>
                    <ProductPrice>
                      <OriginalPrice>₹{product.price}</OriginalPrice>
                      <DiscountedPrice>₹{product.price}</DiscountedPrice>
                    </ProductPrice>
                    <ProductActions>
                      {product.status === 'in_stock' ? (
                        <>
                          <ActionButton onClick={() => handleAddToCart(product)}>Add to Cart</ActionButton>
                          <BuyNowButton onClick={() => handleBuyNow(product)}>Buy Now</BuyNowButton>
                        </>
                      ) : (
                        <DisabledButton disabled>{product.status === 'coming_soon' ? 'Coming Soon' : 'Out of Stock'}</DisabledButton>
                      )}
                    </ProductActions>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductsGrid>
          )}
        </>
      )}
    </StoreContainer>
  );
};

export default Store;