import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => setIsAdmin(!!localStorage.getItem('isAdmin'));
    checkLogin();
    window.addEventListener('storage', checkLogin);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    // Navbar Putih dengan Shadow Halus saat discroll
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo: Menggunakan Warna Navy Gelap agar Kontras */}
        <Link to="/" className={`text-2xl font-extrabold tracking-tight transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
          BEM<span className="text-yellow-500">UNIS</span>.
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Beranda', 'Tentang Kami', 'Struktur'].map((item, idx) => {
             const path = item === 'Beranda' ? '/' : item === 'Tentang Kami' ? '/tentang-kami' : '/struktur';
             return (
               <Link key={idx} to={path} className={`text-sm font-semibold transition-colors hover:text-yellow-500 ${isScrolled ? 'text-slate-600' : 'text-gray-200'}`}>
                 {item}
               </Link>
             )
          })}
          
          <a href="/#event" className={`text-sm font-semibold transition-colors hover:text-yellow-500 ${isScrolled ? 'text-slate-600' : 'text-gray-200'}`}>Event</a>
          <a href="/#galeri" className={`text-sm font-semibold transition-colors hover:text-yellow-500 ${isScrolled ? 'text-slate-600' : 'text-gray-200'}`}>Galeri</a>

          {/* Tombol Login/Admin */}
          {isAdmin ? (
            <div className="flex gap-3">
               <Link to="/admin" className="px-5 py-2.5 rounded-full bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">Dashboard</Link>
            </div>
          ) : (
            <Link to="/login" className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition ${
                isScrolled ? 'border-slate-200 text-slate-900 hover:bg-slate-50' : 'border-white/20 text-white hover:bg-white/10'
            }`}>
              <User size={16} /> Member
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden ${isScrolled ? 'text-slate-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4 text-slate-900">
               <Link to="/" onClick={()=>setIsOpen(false)} className="font-bold">Beranda</Link>
               <Link to="/tentang-kami" onClick={()=>setIsOpen(false)} className="font-bold">Tentang Kami</Link>
               <Link to="/struktur" onClick={()=>setIsOpen(false)} className="font-bold">Struktur</Link>
               <a href="/#event" onClick={()=>setIsOpen(false)} className="font-bold">Event</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;