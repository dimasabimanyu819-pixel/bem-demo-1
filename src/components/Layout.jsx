import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../utils/ScrollToTop';

const Layout = ({ children }) => {
  const location = useLocation();
  // Footer/Navbar tidak muncul di halaman Login (persiapan masa depan)
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <ScrollToTop />
      
      {!isLoginPage && <Navbar />}
      
      {/* Main Content mengisi ruang kosong */}
      <main className="relative z-10 flex-grow">
        {children}
      </main>
      
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Layout;