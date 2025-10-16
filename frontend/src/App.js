import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Modal from './components/Modal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Gallery from './pages/Gallery';
import Movies from './pages/Movies';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProductDetail from './pages/ProductDetail';
import Projects from './pages/Projects';
import Register from './pages/Register';
import Store from './pages/Store';
import TermsAndConditions from './pages/TermsAndConditions';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import Login from './containers/Login';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/register" element={<Register />} />
              <Route path="/store" element={<Store />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;