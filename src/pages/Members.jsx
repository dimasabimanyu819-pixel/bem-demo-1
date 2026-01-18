import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Briefcase } from 'lucide-react';

// UBAH NAMA KOMPONEN JADI Members
const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // DATA DUMMY STATIS
  const [members] = useState([
    { id: 1, name: "Rizky Pratama", position: "Presiden Mahasiswa", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400", department: "BPH" },
    { id: 2, name: "Siti Aisyah", position: "Wakil Presiden", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400", department: "BPH" },
    { id: 3, name: "Budi Santoso", position: "Sekretaris Jenderal", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400", department: "BPH" },
    { id: 4, name: "Dewi Sartika", position: "Bendahara Umum", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400", department: "BPH" },
    { id: 5, name: "Andi Saputra", position: "Menteri Dalam Negeri", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400", department: "Kementerian Dalam Negeri" },
    { id: 6, name: "Maya Indah", position: "Staff Dalam Negeri", image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400", department: "Kementerian Dalam Negeri" },
    { id: 7, name: "Fajar Nugraha", position: "Menteri Luar Negeri", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400", department: "Kementerian Luar Negeri" },
    { id: 8, name: "Citra Kirana", position: "Menteri Kominfo", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400", department: "Kominfo" },
    { id: 9, name: "Dimas Anggara", position: "Staff Kominfo", image_url: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400", department: "Kominfo" },
    { id: 10, name: "Eka Putri", position: "Menteri PSDM", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400", department: "PSDM" },
  ]);

  const filteredMembers = members.filter((member) =>
    (member.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.position || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.department || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="bg-slate-900 text-white py-16 px-6 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
            <span className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-2 inline-block px-4 py-1 bg-white/10 rounded-full">Our Team</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Struktur Organisasi</h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">Kenali orang-orang hebat yang bekerja di balik layar BEM UNIS.</p>
        </div>
        <div className="absolute -bottom-7 left-0 w-full px-6">
            <div className="max-w-xl mx-auto bg-white rounded-full shadow-xl flex items-center p-2 border border-slate-200">
                <div className="p-3 text-slate-400"><Search size={20} /></div>
                <input 
                    type="text" 
                    placeholder="Cari nama anggota atau jabatan..." 
                    className="flex-1 outline-none text-slate-700 font-medium px-2 py-2"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredMembers.map((member) => (
                <motion.div 
                    key={member.id}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 group"
                >
                    <div className="aspect-[4/5] overflow-hidden relative bg-slate-200">
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                            <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">{member.department}</span>
                            <h3 className="text-xl font-bold leading-tight mb-1">{member.name}</h3>
                            <p className="text-slate-300 text-sm font-medium flex items-center gap-2"><Briefcase size={12} /> {member.position}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
        
        {filteredMembers.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                <p>Tidak ditemukan anggota dengan nama tersebut.</p>
            </div>
        )}
      </div>
    </div>
  );
};

// EXPORT Members
export default Members;