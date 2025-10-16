import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  color: white;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  color: #667eea;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

const ProductFeatures = styled.div`
  margin: 1rem 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  padding: 0.5rem 0;
  color: #34495e;
  
  &:before {
    content: "✓";
    color: #27ae60;
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 1rem;
`;

const AddToCartButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
`;

const RelatedProducts = styled.div`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const RelatedCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const RelatedImage = styled.div`
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
`;

const RelatedInfo = styled.div`
  padding: 1rem;
`;

const RelatedTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const RelatedPrice = styled.p`
  color: #667eea;
  font-weight: bold;
`;

const RelatedLink = styled(Link)`
  display: inline-block;
  margin-top: 0.5rem;
  color: #667eea;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Mock product data
    const mockProduct = {
      id: parseInt(id),
      name: 'Premium Laptop',
      price: 999,
      description: 'Experience the perfect blend of performance and portability with our premium laptop. Featuring the latest processor, stunning display, and all-day battery life.',
      icon: '💻',
      features: [
        'Latest Intel Core i7 Processor',
        '16GB DDR4 RAM',
        '512GB SSD Storage',
        '15.6" Full HD Display',
        'All-day Battery Life',
        'Backlit Keyboard',
        'Fingerprint Reader',
        'USB-C and Thunderbolt 4'
      ],
      inStock: true,
      category: 'Electronics',
      rating: 4.5,
      reviews: 128
    };
    
    const mockRelated = [
      { id: 2, name: 'Wireless Mouse', price: 29, icon: '🖱️' },
      { id: 3, name: 'Laptop Stand', price: 49, icon: '📱' },
      { id: 4, name: 'USB-C Hub', price: 39, icon: '🔌' },
    ];
    
    setProduct(mockProduct);
    setRelatedProducts(mockRelated);
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  if (!product) {
    return (
      <ProductContainer>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </ProductContainer>
    );
  }

  return (
    <ProductContainer>
      <ProductContent>
        <ProductImage>{product.icon}</ProductImage>
        
        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductPrice>${product.price}</ProductPrice>
          
          <ProductDescription>
            {product.description}
          </ProductDescription>
          
          <ProductFeatures>
            <h3>Key Features:</h3>
            <FeatureList>
              {product.features.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </FeatureList>
          </ProductFeatures>
          
          <QuantitySelector>
            <span>Quantity:</span>
            <QuantityButton onClick={() => handleQuantityChange(-1)}>
              -
            </QuantityButton>
            <QuantityInput
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              min="1"
              max="10"
            />
            <QuantityButton onClick={() => handleQuantityChange(1)}>
              +
            </QuantityButton>
          </QuantitySelector>
          
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </AddToCartButton>
          
          <ProductMeta>
            <MetaItem>
              <span>⭐</span>
              <span>{product.rating} ({product.reviews} reviews)</span>
            </MetaItem>
            <MetaItem>
              <span>📦</span>
              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </MetaItem>
            <MetaItem>
              <span>🚚</span>
              <span>Free Shipping</span>
            </MetaItem>
          </ProductMeta>
        </ProductInfo>
      </ProductContent>
      
      <RelatedProducts>
        <SectionTitle>Related Products</SectionTitle>
        <RelatedGrid>
          {relatedProducts.map(related => (
            <RelatedCard key={related.id}>
              <RelatedImage>{related.icon}</RelatedImage>
              <RelatedInfo>
                <RelatedTitle>{related.name}</RelatedTitle>
                <RelatedPrice>${related.price}</RelatedPrice>
                <RelatedLink to={`/product/${related.id}`}>
                  View Details
                </RelatedLink>
              </RelatedInfo>
            </RelatedCard>
          ))}
        </RelatedGrid>
      </RelatedProducts>
    </ProductContainer>
  );
};

export default ProductDetail;