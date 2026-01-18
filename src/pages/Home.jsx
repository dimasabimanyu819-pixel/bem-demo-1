import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  ChevronRight, Calendar, Users, Trophy, Send, ArrowUpRight, X, 
  Clock, MapPin, Share2, AlertCircle, CheckCircle2, Sparkles, Image as ImageIcon,
  Quote, Target, Lightbulb, Play, MousePointer2, Plus, Minus, HelpCircle
} from 'lucide-react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- 1. BACKGROUND DEKORASI (GRADASI BIRU-PUTIH + MORPHING HALUS) ---
const AnimatedBlueHill = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white"></div>
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[150px] md:h-[250px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <motion.path
                animate={{
                    d: [
                        "M0,0 H1200 V200 Q600,50 0,200 Z", 
                        "M0,0 H1200 V200 Q600,80 0,200 Z", 
                        "M0,0 H1200 V200 Q600,50 0,200 Z", 
                    ]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                fill="#ffffff"
            />
        </svg>
    </div>
  </div>
);

// --- 2. KOMPONEN TILT ---
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

// --- 3. KOMPONEN FAQ ITEM (ACCORDION) ---
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div 
      initial={false}
      className={`border border-blue-100 rounded-2xl overflow-hidden mb-4 transition-colors duration-300 ${isOpen ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-slate-50'}`}
    >
      <button 
        onClick={onClick}
        className="flex items-center justify-between w-full p-6 text-left"
      >
        <span className={`text-lg font-bold ${isOpen ? 'text-blue-600' : 'text-slate-800'}`}>
          {question}
        </span>
        <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
          {isOpen ? <Minus size={20}/> : <Plus size={20}/>}
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-blue-100/50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- ANIMASI VARIAN ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(0); // State untuk FAQ (index 0 terbuka default)

  // --- DATA DUMMY ---
  const [events] = useState([
    {
        id: 1,
        title: "Latihan Kepemimpinan Manajemen Mahasiswa",
        date: "20 Okt 2026",
        time: "08:00 - 15:00",
        location: "Auditorium UNIS",
        image_url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800",
        status: "Open",
        description: "Membangun karakter pemimpin yang berintegritas dan adaptif di era digital. Kegiatan ini wajib bagi mahasiswa baru."
    },
    {
        id: 2,
        title: "UNIS Fair & Expo 2026",
        date: "15 Nov 2026",
        time: "09:00 - Selesai",
        location: "Lapangan Utama",
        image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
        status: "Open",
        description: "Pameran karya mahasiswa dan bazar kewirausahaan terbesar tahun ini. Dimeriahkan oleh band ibukota."
    },
    {
        id: 3,
        title: "Seminar Nasional Teknologi",
        date: "05 Des 2026",
        time: "13:00 - 16:00",
        location: "Zoom Meeting",
        image_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800",
        status: "Closed",
        description: "Membahas perkembangan Artificial Intelligence dalam dunia pendidikan."
    }
  ]);

  const [gallery] = useState([
    { id: 1, image_url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800", caption: "Rapat Kerja BEM" },
    { id: 2, image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800", caption: "Bakti Sosial Desa" },
    { id: 3, image_url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800", caption: "Inaugurasi Malam" },
    { id: 4, image_url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800", caption: "Diskusi Publik" },
  ]);

  const [members] = useState([
    { id: 1, name: "Rizky Pratama", position: "Presiden Mahasiswa", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400", motto: "Bergerak atau tergantikan." },
    { id: 2, name: "Siti Aisyah", position: "Wakil Presiden", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400", motto: "Kerja nyata untuk almamater." },
    { id: 3, name: "Budi Santoso", position: "Sekretaris Jenderal", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400", motto: "Tertib administrasi pangkal keberhasilan." },
    { id: 4, name: "Dewi Sartika", position: "Bendahara Umum", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400", motto: "Transparan dan Akuntabel." },
  ]);

  // --- DATA FAQ ---
  const faqList = [
    {
      q: "Bagaimana cara bergabung menjadi pengurus BEM UNIS?",
      a: "Rekrutmen terbuka (Open Recruitment) biasanya diadakan setahun sekali di awal periode kepengurusan (sekitar bulan Januari-Februari). Pantau terus Instagram resmi kami untuk informasi persyaratan dan timeline seleksi."
    },
    {
      q: "Apakah mahasiswa semester akhir boleh mengikuti kegiatan BEM?",
      a: "Tentu saja! Kegiatan BEM seperti seminar, workshop, dan event terbuka untuk seluruh mahasiswa aktif UNIS dari semua angkatan dan jurusan."
    },
    {
      q: "Bagaimana cara menyampaikan aspirasi atau keluhan perkuliahan?",
      a: "Anda bisa menggunakan formulir 'Sampaikan Aspirasi' yang ada di bagian bawah website ini. Aspirasi Anda akan langsung terhubung ke WhatsApp Center Advokasi kami dan dijamin kerahasiaannya."
    },
    {
      q: "Di mana sekretariat BEM UNIS berada?",
      a: "Sekretariat kami berlokasi di Gedung Student Center (SC) Lantai 1, Kampus Pusat UNIS. Kami buka setiap hari kerja pukul 09.00 - 16.00 WIB."
    }
  ];

  const [loading] = useState(false);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const carouselRef = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if(carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [members]);

  const slideImages = gallery.length > 0 ? gallery.map(item => item.image_url) : [];

  useEffect(() => {
    if (slideImages.length === 0) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slideImages.length), 5000); 
    return () => clearInterval(timer);
  }, [slideImages]);

  const handleAspirasi = (e) => {
    e.preventDefault();
    const { nama, no_hp, jurusan, angkatan, pesan } = e.target;
    const text = `Halo Admin BEM, saya ingin menyampaikan aspirasi.\n\n📋 *DATA DIRI*\nNama: ${nama.value}\nNo HP: ${no_hp.value}\nJurusan: ${jurusan.value}\nAngkatan: ${angkatan.value}\n\n💬 *ISI ASPIRASI*\n"${pesan.value}"`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  const bphMembers = members.filter(member => {
    const pos = member.position ? member.position.toLowerCase() : '';
    return pos.includes('presiden') || pos.includes('wakil') || pos.includes('sekretaris') || pos.includes('bendahara') || pos.includes('ketua');
  });

  return (
    <div className="bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-blue-600 selection:text-white perspective-1000" ref={containerRef}>
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900 pb-32">
        <motion.div className="absolute inset-0 z-0" style={{ y: yBg }}>
           <AnimatePresence mode='wait'>
            <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slideImages[currentSlide]})` }} />
           </AnimatePresence>
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/70 to-slate-900/90"></div>
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        </motion.div>
        
        <div className="container relative z-10 mx-auto px-6 pt-20">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto text-center perspective-1000">
            <TiltCard className="inline-block">
                <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-400 font-bold text-sm mb-8 shadow-2xl cursor-default">
                    <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>
                    Kabinet Sinergi Aksi 2026
                </div>
            </TiltCard>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight tracking-tight text-white drop-shadow-xl">
              Sinergi Aksi, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">Wujudkan Bukti.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed font-light max-w-2xl mx-auto drop-shadow-md">
              Katalisator pergerakan mahasiswa yang inklusif, profesional, dan berdampak nyata bagi almamater dan bangsa.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-5 justify-center items-center pb-4">
              <TiltCard><a href="#event" className="group px-10 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full transition-all shadow-lg flex items-center gap-3">Jelajahi Program <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/></a></TiltCard>
              <TiltCard><a href="#aspirasi" className="group px-10 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center gap-3">Sampaikan Aspirasi <Send size={18} className="group-hover:-rotate-12 transition-transform"/></a></TiltCard>
            </motion.div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"><span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Scroll Down</span><div className="w-[1px] h-12 bg-gradient-to-b from-yellow-500 to-transparent"></div></motion.div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg className="relative block w-full h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50/5"></path>
            </svg>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="relative z-30 -mt-24 pb-24">
        <div className="container mx-auto px-6">
          <TiltCard className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/50 relative z-10">
               {[{ label: 'Anggota', val: '120+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' }, { label: 'Proker', val: '24', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' }, { label: 'Event', val: '10+', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' }, { label: 'Tahun', val: '1966', icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-100' }].map((stat, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center px-4 group cursor-default">
                   <div className={`p-4 rounded-2xl mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}><stat.icon size={28} /></div>
                   <h3 className="text-4xl font-extrabold text-slate-900 mb-1">{stat.val}</h3>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                 </div>
               ))}
             </div>
          </TiltCard>
        </div>
      </section>

      {/* 3. VIDEO & TENTANG KAMI */}
      <section className="py-24 relative overflow-hidden bg-white">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
         <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full lg:w-1/2 relative group">
                <TiltCard className="w-full">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-40 transition duration-700"></div>
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white bg-black">
                        <iframe className="w-full aspect-video pointer-events-none md:pointer-events-auto" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ScZ_sK7oQf4k1n" title="Profile" allowFullScreen></iframe>
                    </div>
                </TiltCard>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-1/2">
               <span className="inline-flex items-center gap-2 text-blue-600 font-bold tracking-widest text-sm uppercase mb-4 px-3 py-1 bg-blue-50 rounded-full border border-blue-100"><Sparkles size={14}/> Tentang Kami</span>
               <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">Mewujudkan BEM yang <span className="text-blue-600">Unggul & Berintegritas.</span></h2>
               <p className="text-slate-600 text-lg mb-8 leading-relaxed">Kami percaya bahwa kolaborasi adalah kunci. BEM UNIS hadir bukan hanya sebagai organisasi, tapi sebagai keluarga yang tumbuh bersama untuk menciptakan dampak yang berkelanjutan.</p>
               <div className="space-y-4">
                   {['Inklusif merangkul seluruh elemen.', 'Profesional dalam tata kelola.', 'Responsif terhadap isu terkini.'].map((item,i)=>(
                       <TiltCard key={i}><div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors"><div className="p-2 bg-green-100 text-green-600 rounded-full shrink-0"><CheckCircle2 size={18}/></div><span className="font-semibold text-slate-700">{item}</span></div></TiltCard>
                   ))}
               </div>
            </motion.div>
         </div>
      </section>

      {/* 4. VISI & MISI */}
      <section className="py-24 bg-slate-50 relative">
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
                <TiltCard><div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-shadow h-full"><div className="absolute top-0 right-0 p-10 text-slate-100 opacity-50 group-hover:scale-110 transition-transform duration-700"><Lightbulb size={150}/></div><div className="relative z-10"><div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm"><Lightbulb size={32}/></div><h3 className="text-3xl font-extrabold text-slate-900 mb-4">Visi Kami</h3><p className="text-slate-600 text-lg leading-relaxed font-medium">"Terwujudnya BEM UNIS sebagai poros pergerakan mahasiswa yang Inklusif, Progresif, dan Berintegritas demi terciptanya kebermanfaatan nyata."</p></div></div></TiltCard>
                <TiltCard><div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:shadow-xl transition-shadow text-white h-full"><div className="absolute top-0 right-0 p-10 text-slate-800 opacity-50 group-hover:scale-110 transition-transform duration-700"><Target size={150}/></div><div className="relative z-10"><div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-400 mb-6 backdrop-blur-md border border-white/10"><Target size={32}/></div><h3 className="text-3xl font-extrabold mb-4">Misi Kami</h3><ul className="space-y-4">{['Tata kelola organisasi profesional.', 'Pengembangan minat & bakat.', 'Advokasi kebijakan pro-mahasiswa.', 'Pengabdian masyarakat berdampak.'].map((misi, i) => (<li key={i} className="flex items-center gap-3 text-slate-300"><div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>{misi}</li>))}</ul></div></div></TiltCard>
            </div>
         </div>
      </section>

      {/* 5. SAMBUTAN KETUA */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="w-full md:w-5/12 relative group">
                <TiltCard><div className="absolute top-6 -left-6 w-full h-full bg-slate-200 rounded-[2rem] -z-10 group-hover:rotate-2 transition-transform duration-500"></div><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800" alt="Ketua" className="relative w-full rounded-[2rem] shadow-2xl object-cover aspect-[3/4]" /><div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50"><p className="font-bold text-slate-900 text-xl">Ahmad Fulan</p><p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Presiden Mahasiswa</p></div></TiltCard>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full md:w-7/12">
                <Quote className="text-blue-200 mb-6" size={64} />
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">"Bergerak Bersama, <br/>Berdampak Nyata."</h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed"><p>Mahasiswa adalah agen perubahan. Di BEM UNIS, kami tidak hanya sekadar berorganisasi, tapi kami membangun ekosistem di mana setiap ide dihargai dan setiap aksi memiliki arti.</p></div>
                <div className="mt-10 pt-10 border-t border-slate-200"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Tanda Tangan" className="h-16 opacity-50" /></div>
            </motion.div>
        </div>
      </section>

      {/* 6. STRUKTUR INTI (FILTERED BPH ONLY) */}
      <section className="relative overflow-hidden pt-32 md:pt-48 pb-24" id="struktur">
        <AnimatedBlueHill />
        <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 max-w-2xl mx-auto">
                <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">Kepemimpinan</span>
                <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Nahkoda Kabinet (BPH)</h2>
            </motion.div>
            
            {loading ? <p className="text-slate-500">Memuat...</p> : (
                <motion.div ref={carouselRef} className="cursor-grab overflow-hidden relative active:cursor-grabbing">
                    {bphMembers.length > 0 ? (
                    <motion.div 
                        drag="x" 
                        dragConstraints={{ right: 0, left: -carouselWidth }} 
                        className="flex gap-6 py-10 px-4 w-fit mx-auto" 
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {bphMembers.map((member) => (
                            <motion.div key={member.id} className="min-w-[300px] md:min-w-[340px] h-[450px]">
                                <TiltCard className="h-full">
                                    <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl group border border-white/60 bg-white/90 backdrop-blur-md">
                                        <img src={member.image_url} alt={member.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                        <div className="absolute bottom-0 left-0 w-full p-8 text-left translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="w-10 h-1 bg-yellow-500 mb-4 rounded-full"></div>
                                            <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{member.name}</h3>
                                            <p className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-3">{member.position}</p>
                                            <p className="text-slate-200 text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">"{member.motto}"</p>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </motion.div>
                    ) : (
                        <p className="text-slate-500 italic">Data BPH belum tersedia.</p>
                    )}
                </motion.div>
            )}
            {bphMembers.length > 0 && <div className="mt-8 flex justify-center items-center gap-2 text-slate-500 text-sm animate-pulse"><MousePointer2 size={16} className="rotate-[-15deg]"/> Geser untuk melihat</div>}
            <div className="mt-12"><Link to="/struktur" className="inline-flex items-center gap-2 px-8 py-4 border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 rounded-full font-bold transition-all">Lihat Struktur Lengkap <ArrowUpRight/></Link></div>
        </div>
      </section>

      {/* 7. EVENT SECTION */}
      <section className="relative overflow-hidden pt-32 md:pt-48 pb-24" id="event">
        <AnimatedBlueHill />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div><span className="text-blue-600 font-bold text-sm tracking-widest uppercase flex items-center gap-2"><Calendar size={16}/> Agenda Terbaru</span><h2 className="text-4xl font-extrabold text-slate-900 mt-2">Program Unggulan</h2></div>
            <a href="#" className="hidden md:flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition">Lihat Kalender <ArrowUpRight size={18}/></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
               <TiltCard key={event.id} className="h-full">
                   <motion.div layoutId={`event-${event.id}`} onClick={() => setSelectedEvent(event)} className="bg-white/95 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group border border-white/60 flex flex-col h-full relative">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img src={event.image_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        <div className="absolute top-4 right-4 z-20">{event.status === 'Closed' ? <span className="bg-white/90 backdrop-blur text-red-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1"><AlertCircle size={12}/> Closed</span> : <span className="bg-white/90 backdrop-blur text-green-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1"><CheckCircle2 size={12}/> Open</span>}</div>
                      </div>
                      <div className="p-8 flex flex-col flex-1 relative">
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-bold mb-4 bg-blue-50 w-fit px-3 py-1 rounded-full"><Calendar size={14} /> {event.date}</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition leading-snug">{event.title}</h3>
                        <p className="text-slate-500 line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">{event.description}</p>
                        <div className="pt-6 border-t border-slate-100 flex items-center text-blue-600 font-bold group/btn">Baca Detail <ArrowUpRight size={18} className="ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"/></div>
                      </div>
                   </motion.div>
               </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GALERI */}
      <section className="py-32 relative overflow-hidden bg-slate-900" id="galeri">
        <div className="absolute inset-0 z-0">
            <AnimatePresence mode='wait'>
                <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 bg-cover bg-center blur-md scale-105" style={{ backgroundImage: `url(${slideImages[currentSlide]})` }} />
            </AnimatePresence>
            <div className="absolute inset-0 bg-slate-900/70"></div> 
        </div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16"><span className="text-blue-400 font-bold text-sm uppercase flex items-center justify-center gap-2 mb-2"><ImageIcon size={16}/> Dokumentasi</span><h2 className="text-4xl font-extrabold text-white mt-2 drop-shadow-lg">Momen Kebersamaan</h2></div>
            {loading ? <p className="text-center text-white">Memuat...</p> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[250px]">
                    {gallery.map((img, idx) => (
                        <TiltCard key={img.id} className={`${idx === 0 || idx === 3 ? 'col-span-2 row-span-2' : ''}`}>
                            <div className="rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-2xl hover:shadow-white/20 transition-all h-full w-full border border-white/10">
                                <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                    <p className="text-white font-medium text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.caption}</p>
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            )}
        </div>
      </section>

      {/* 9. FAQ SECTION (ADDED NEW!) */}
      <section className="py-24 relative overflow-hidden bg-white" id="faq">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold text-sm uppercase flex items-center justify-center gap-2 mb-2"><HelpCircle size={16}/> Informasi</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Sering Ditanyakan (FAQ)</h2>
            </div>
            
            <div className="space-y-4">
              {faqList.map((item, index) => (
                <FAQItem 
                  key={index}
                  question={item.q}
                  answer={item.a}
                  isOpen={openFAQ === index}
                  onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. ASPIRASI */}
      <section className="py-32 relative overflow-hidden bg-slate-900 text-white" id="aspirasi">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20"><svg className="relative block w-full h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path></svg></div>
        <div className="container relative z-10 mx-auto px-6 grid md:grid-cols-2 gap-20 items-center pt-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="text-5xl font-extrabold mb-8 leading-tight">Suara Anda, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Energi Kami.</span></h2>
                <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-lg">Sampaikan gagasan, kritik, dan masukan Anda secara detail.</p>
                <TiltCard className="inline-block"><div className="flex items-center gap-5 p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/15 transition"><div className="p-4 bg-green-500 rounded-full text-white shadow-lg shadow-green-500/30"><Send size={24}/></div><div><p className="font-bold text-lg">WhatsApp Center</p><p className="text-slate-300 text-sm">Respon Cepat 24 Jam</p></div></div></TiltCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-white text-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative">
                <h3 className="text-2xl font-bold mb-8">Formulir Aspirasi</h3>
                <form onSubmit={handleAspirasi} className="space-y-5 relative z-10">
                    <div className="grid grid-cols-2 gap-5"><input type="text" name="nama" placeholder="Nama Lengkap" className="input-field" required /><input type="tel" name="no_hp" placeholder="No WhatsApp" className="input-field" required /></div>
                    <div className="grid grid-cols-2 gap-5"><input type="text" name="jurusan" placeholder="Jurusan" className="input-field" required /><input type="number" name="angkatan" placeholder="Angkatan" className="input-field" required /></div>
                    <textarea name="pesan" rows="5" placeholder="Tulis aspirasi..." className="input-field resize-none" required></textarea>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl transition shadow-lg flex items-center justify-center gap-3">Kirim Aspirasi <Send size={20}/></button>
                </form>
            </motion.div>
        </div>
      </section>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {selectedEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                <motion.div layoutId={`event-${selectedEvent.id}`} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[2rem] max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] relative">
                    <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 z-50 bg-white p-3 rounded-full hover:bg-slate-100 text-slate-500 transition shadow-md"><X size={24} /></button>
                    <div className="w-full md:w-1/2 bg-slate-100 relative group"><img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div></div>
                    <div className="w-full md:w-1/2 p-10 md:p-14 overflow-y-auto custom-scrollbar bg-white">
                        <div className="flex items-center gap-3 mb-6"><span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">{selectedEvent.category || 'Event'}</span>{selectedEvent.status === 'Closed' ? <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase flex gap-1"><AlertCircle size={14}/> Closed</span> : <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase flex gap-1"><CheckCircle2 size={14}/> Open</span>}</div>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">{selectedEvent.title}</h2>
                        <div className="grid gap-6 mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex items-start gap-5"><div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Calendar size={24}/></div><div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tanggal</p><p className="font-bold text-lg text-slate-900">{selectedEvent.date}</p></div></div>
                            <div className="flex items-start gap-5"><div className="p-3 bg-purple-100 text-purple-600 rounded-2xl"><Clock size={24}/></div><div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Waktu</p><p className="font-bold text-lg text-slate-900">{selectedEvent.time || '08:00 - Selesai'}</p></div></div>
                            <div className="flex items-start gap-5"><div className="p-3 bg-green-100 text-green-600 rounded-2xl"><MapPin size={24}/></div><div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Lokasi</p><p className="font-bold text-lg text-slate-900">{selectedEvent.location || 'Kampus UNIS'}</p></div></div>
                        </div>
                        <div className="prose prose-slate prose-lg text-slate-600 whitespace-pre-line leading-relaxed mb-10">{selectedEvent.description}</div>
                        <div className="flex gap-5 pt-8 border-t border-slate-100">
                             {selectedEvent.status === 'Closed' ? <button disabled className="flex-1 bg-slate-200 text-slate-500 py-4 rounded-2xl font-bold cursor-not-allowed flex justify-center items-center gap-3 text-lg"><AlertCircle size={20}/> Ditutup</button> : <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-2xl font-bold shadow-xl flex justify-center items-center gap-3 text-lg">Daftar <ArrowUpRight size={20}/></button>}
                             <button className="px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-slate-900 font-bold"><Share2 size={24} /></button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`.input-field { width: 100%; background: #f8fafc; border: 2px solid #e2e8f0; padding: 16px; border-radius: 12px; outline: none; transition: all 0.2s; font-weight: 500; color: #334155; } .input-field:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); } .input-field::placeholder { color: #94a3b8; }`}</style>
    </div>
  );
};

export default Home;