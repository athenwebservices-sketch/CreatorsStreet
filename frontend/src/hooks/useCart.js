import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useCart = () => {
  const { cart, setCart } = useContext(AppContext);
  return { cart, setCart };
};
