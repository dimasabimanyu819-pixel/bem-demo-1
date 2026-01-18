import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronRight, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-slate-300 pt-24 pb-10 border-t border-slate-800/60 font-sans relative overflow-hidden">
        
        {/* Dekorasi Background (Glow Halus di atas) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
                
                {/* 1. BRANDING & SOSMED (Lebar: 4 Kolom) */}
                <div className="md:col-span-4 space-y-6">
                    <Link to="/" className="flex items-center gap-3 group w-fit">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform">
                            B
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-extrabold text-white tracking-tight leading-none">BEM <span className="text-blue-500">UNIS</span>.</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Kabinet Sinergi Aksi</span>
                        </div>
                    </Link>
                    <p className="text-slate-400 leading-relaxed text-sm pr-4">
                        Wadah aspirasi, kreativitas, dan pergerakan mahasiswa Universitas Islam Syekh Yusuf Tangerang. Mewujudkan perubahan nyata untuk almamater dan bangsa.
                    </p>
                    <div className="flex gap-3 pt-2">
                        {[
                            { icon: Instagram, href: "#" },
                            { icon: Youtube, href: "#" },
                            { icon: Twitter, href: "#" },
                            { icon: Linkedin, href: "#" }
                        ].map((item, i) => (
                            <a key={i} href={item.href} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 group">
                                <item.icon size={18} className="group-hover:scale-110 transition-transform"/>
                            </a>
                        ))}
                    </div>
                </div>

                {/* 2. TAUTAN (Lebar: 2 Kolom) */}
                <div className="md:col-span-2">
                    <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        Jelajahi <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    </h4>
                    <ul className="space-y-4 text-sm">
                        {[
                            { label: 'Beranda', path: '/' },
                            { label: 'Tentang Kami', path: '/#tentang' },
                            { label: 'Struktur Organisasi', path: '/struktur' },
                            { label: 'Program Kerja', path: '/#event' },
                            { label: 'Galeri Kegiatan', path: '/#galeri' },
                            { label: 'Kontak Aspirasi', path: '/#aspirasi' }
                        ].map((link, idx) => (
                            <li key={idx}>
                                <Link to={link.path} className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"/> 
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. KONTAK INFO (Lebar: 3 Kolom) */}
                <div className="md:col-span-3">
                    <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        Hubungi Kami <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    </h4>
                    <ul className="space-y-5 text-sm">
                        <li className="flex items-start gap-4 group">
                            <div className="p-2.5 bg-blue-900/20 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <MapPin size={18}/>
                            </div>
                            <span className="text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                                Jl. Syekh Yusuf No. 10, Babakan, Kec. Tangerang, Kota Tangerang, Banten 15118.
                            </span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="p-2.5 bg-blue-900/20 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Mail size={18}/>
                            </div>
                            <span className="text-slate-400 group-hover:text-white transition-colors">humas@bemunis.ac.id</span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="p-2.5 bg-blue-900/20 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Phone size={18}/>
                            </div>
                            <span className="text-slate-400 group-hover:text-white transition-colors">+62 812-3456-7890</span>
                        </li>
                    </ul>
                </div>

                {/* 4. GOOGLE MAPS (Lebar: 3 Kolom) - SESUAI REQUEST */}
                <div className="md:col-span-3">
                    <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        Lokasi Kampus <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    </h4>
                    <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl relative group">
                        {/* Overlay saat hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 pointer-events-none"></div>
                        
                        <iframe 
                            title="Lokasi UNIS"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.336796933939!2d106.63402731476916!3d-6.219244995497919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f9336d3c7e3b%3A0x8633367175573430!2sUniversitas%20Islam%20Syekh%20Yusuf!5e0!3m2!1sid!2sid!4v1645498234567!5m2!1sid!2sid" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(85%)' }} // Filter Dark Mode Map
                            allowFullScreen="" 
                            loading="lazy"
                            className="group-hover:filter-none transition-all duration-700"
                        ></iframe>
                        
                        <a 
                            href="https://goo.gl/maps/UNIS" 
                            target="_blank" 
                            rel="noreferrer"
                            className="absolute bottom-3 right-3 z-20 bg-white text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            <Globe size={12}/> Buka Peta
                        </a>
                    </div>
                </div>

            </div>

            {/* FOOTER BOTTOM */}
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-xs text-center md:text-left">
                    &copy; {new Date().getFullYear()} BEM UNIS Tangerang. Developed with ❤️ by Dinas Kominfo.
                </p>
                <div className="flex gap-6 text-xs text-slate-500 font-medium">
                    <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;