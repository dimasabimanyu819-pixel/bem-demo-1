import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, MousePointer2 } from 'lucide-react';

// --- KOMPONEN KARTU MIRING (TILT CARD) ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  function handleMouseLeave() { x.set(0); y.set(0); }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]); 
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative transition-all duration-300 ease-out ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">{children}</div>
    </motion.div>
  );
};

const StrukturPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // DATA DUMMY
  const [members] = useState([
    { id: 1, name: "Rizky Pratama", position: "Presiden Mahasiswa", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400", department: "BPH Inti", motto: "Hidup bermanfaat." },
    { id: 2, name: "Siti Aisyah", position: "Wakil Presiden", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400", department: "BPH Inti", motto: "Kerja nyata." },
    { id: 3, name: "Budi Santoso", position: "Sekretaris Jenderal", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400", department: "BPH Inti", motto: "Tertib administrasi." },
    { id: 4, name: "Dewi Sartika", position: "Bendahara Umum", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400", department: "BPH Inti", motto: "Transparan." },
    { id: 5, name: "Andi Saputra", position: "Menteri Dalam Negeri", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400", department: "Kementerian Dalam Negeri", motto: "Sinergi internal." },
    { id: 6, name: "Maya Indah", position: "Staff Dalam Negeri", image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400", department: "Kementerian Dalam Negeri", motto: "Semangat mengabdi." },
    { id: 7, name: "Fajar Nugraha", position: "Menteri Luar Negeri", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400", department: "Kementerian Luar Negeri", motto: "Kolaborasi global." },
    { id: 8, name: "Citra Kirana", position: "Menteri Kominfo", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400", department: "Dinas Kominfo", motto: "Informasi cepat." },
    { id: 9, name: "Dimas Anggara", position: "Staff Kominfo", image_url: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400", department: "Dinas Kominfo", motto: "Kreatif tanpa batas." },
    { id: 10, name: "Eka Putri", position: "Menteri PSDM", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400", department: "Dinas PSDM", motto: "Unggul berkarakter." },
  ]);

  const filteredMembers = members.filter((member) =>
    (member.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.position || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.department || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueDepartments = [...new Set(filteredMembers.map(item => item.department))];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* === HEADER SECTION PERBAIKAN ===
        1. overflow-hidden DIHAPUS agar search bar yang nongol ke bawah tidak terpotong.
        2. pb-32 (Padding Bottom besar) ditambahkan agar ada ruang untuk search bar.
        3. z-20 ditambahkan di search bar agar muncul di layer paling atas.
      */}
      <div className="bg-slate-900 text-white pt-24 pb-32 px-6 mb-20 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
        <div className="container mx-auto text-center relative z-10">
            <span className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-4 inline-block px-4 py-1 bg-white/10 rounded-full border border-white/10">Our Team</span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Struktur Organisasi</h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">Kenali orang-orang hebat yang bekerja di balik layar BEM UNIS.</p>
        </div>
        
        {/* Search Bar - Z-Index Tinggi & Posisi Absolute */}
        <div className="absolute -bottom-8 left-0 w-full px-6 z-20">
            <div className="max-w-xl mx-auto bg-white rounded-full shadow-2xl flex items-center p-2 border border-slate-200">
                <div className="p-3 text-slate-400"><Search size={24} /></div>
                <input 
                    type="text" 
                    placeholder="Cari nama anggota atau jabatan..." 
                    className="flex-1 outline-none text-slate-700 font-medium px-2 py-2 text-lg bg-transparent"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* CONTENT GROUPING PER DIVISI (JUDUL TENGAH) */}
      <div className="container mx-auto px-6 mt-24">
        {uniqueDepartments.length > 0 ? (
            uniqueDepartments.map((deptName, index) => (
                <div key={index} className="mb-24">
                    
                    {/* JUDUL DIVISI DI TENGAH */}
                    <div className="flex flex-col items-center justify-center mb-12">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 text-center"
                        >
                            {deptName}
                        </motion.h2>
                        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                    </div>

                    {/* Grid Anggota */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
                        {filteredMembers
                            .filter(member => member.department === deptName)
                            .map((member) => (
                                <div key={member.id} className="h-[400px]">
                                    <TiltCard className="h-full">
                                        <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-xl group border border-white/60 bg-white/90 backdrop-blur-md">
                                            <img src={member.image_url} alt={member.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"/>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-90 transition-opacity"></div>
                                            <div className="absolute bottom-0 left-0 w-full p-6 text-left translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="w-8 h-1 bg-yellow-500 mb-3 rounded-full"></div>
                                                <h3 className="text-xl font-bold text-white mb-1 leading-tight">{member.name}</h3>
                                                <p className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-2">{member.position}</p>
                                                <span className="inline-block px-2 py-1 bg-white/10 text-white text-[10px] rounded-md border border-white/20 mb-2">{member.department}</span>
                                                <p className="text-slate-300 text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">"{member.motto}"</p>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </div>
                        ))}
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-20 text-slate-500">
                <p className="text-xl font-medium">Tidak ditemukan anggota dengan nama tersebut.</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                   <MousePointer2 size={16}/> Reset Pencarian
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default StrukturPage;