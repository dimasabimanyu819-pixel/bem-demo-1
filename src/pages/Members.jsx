import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Users } from 'lucide-react';

// --- KOMPONEN TILT ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5); y.set((clientY - top) / height - 0.5);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);
  return (
    <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`relative transition-all duration-300 ease-out ${className}`}>
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">{children}</div>
    </motion.div>
  );
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost/bem-api/backend/api.php?action=get_members')
      .then(res => { setMembers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // 1. Grouping Member
  const groupedMembers = members.reduce((groups, member) => {
    const division = member.division || 'Lainnya'; // Default ke 'Lainnya' jika kosong
    if (!groups[division]) groups[division] = [];
    groups[division].push(member);
    return groups;
  }, {});

  // 2. Logic Sorting (BPH Inti Wajib Paling Atas)
  // Pastikan nama di sini SAMA PERSIS dengan yang diinput di Dashboard Admin
  const divisionOrder = [
      "BPH Inti", 
      "Dinas Kominfo", 
      "Dinas Advokasi", 
      "Dinas Minat Bakat", 
      "Dinas PSDM", 
      "Dinas Sosmas", 
      "Dinas Kastrat", 
      "Lainnya"
  ];

  const sortedDivisions = Object.keys(groupedMembers).sort((a, b) => {
     const indexA = divisionOrder.indexOf(a);
     const indexB = divisionOrder.indexOf(b);
     
     // Jika tidak ada di list, taruh di paling bawah
     const valA = indexA === -1 ? 999 : indexA;
     const valB = indexB === -1 ? 999 : indexB;

     return valA - valB;
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-20 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* HEADER */}
      <section className="bg-[#020617] text-white py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent to-slate-900/80"></div>
         
         <div className="container mx-auto px-6 text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">Our Team</span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Struktur Organisasi</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light">Kenali orang-orang hebat yang bekerja di balik layar BEM UNIS untuk mewujudkan visi bersama.</p>
         </div>
      </section>

      {/* SEARCH BAR (Floating) */}
      <div className="container mx-auto px-6 -mt-8 relative z-20 mb-20">
         <div className="bg-white/80 backdrop-blur-xl p-2 rounded-full shadow-2xl max-w-xl mx-auto flex items-center border border-white/50">
            <div className="p-3 bg-slate-100 rounded-full text-slate-400 ml-1"><Search size={20}/></div>
            <input 
                type="text" 
                placeholder="Cari nama anggota atau jabatan..." 
                className="w-full bg-transparent outline-none text-slate-700 font-medium px-4 py-3 placeholder:text-slate-400"
                onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* LIST MEMBER */}
      <div className="container mx-auto px-6 pb-32">
        {loading ? <p className="text-center text-slate-500 animate-pulse">Sedang memuat data...</p> : (
            sortedDivisions.map((divName) => {
                const divMembers = groupedMembers[divName].filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.position.toLowerCase().includes(search.toLowerCase()));
                if(divMembers.length === 0) return null;

                return (
                    <div key={divName} className="mb-24 last:mb-0">
                        {/* Judul Divisi dengan Garis */}
                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-[2px] bg-gradient-to-r from-transparent to-slate-200 flex-1"></div>
                            <h2 className="text-3xl font-extrabold text-slate-900 uppercase tracking-widest text-center px-6 py-2 border-2 border-slate-900 rounded-full">{divName}</h2>
                            <div className="h-[2px] bg-gradient-to-l from-transparent to-slate-200 flex-1"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {divMembers.map((member) => (
                                <TiltCard key={member.id} className="h-full">
                                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-100 text-center group h-full flex flex-col items-center">
                                        <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-6 border-[6px] border-slate-50 group-hover:border-blue-100 transition-colors shadow-inner relative">
                                            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500 transform group-hover:scale-110"/>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                                        <p className="text-blue-600 font-bold text-xs uppercase tracking-wide mb-4 px-3 py-1 bg-blue-50 rounded-full inline-block">{member.position}</p>
                                        <div className="mt-auto pt-4 border-t border-slate-50 w-full">
                                            <p className="text-slate-400 text-sm italic font-medium">"{member.motto || 'Sinergi Aksi'}"</p>
                                        </div>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};

export default Members;