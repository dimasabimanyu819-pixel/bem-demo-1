import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { History, Users, Award, Heart, Sparkles, Target, Lightbulb, CheckCircle2 } from 'lucide-react';

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

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-20 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. HERO HEADER */}
      <section className="relative py-32 bg-[#020617] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="inline-flex items-center gap-2 text-yellow-400 font-bold tracking-widest text-xs uppercase mb-6 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                    <Sparkles size={14}/> Tentang BEM UNIS
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                    Dedikasi untuk <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-cyan-400">Almamater & Bangsa</span>
                </h1>
                <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                    Mengenal lebih dekat sejarah, nilai, dan semangat yang menggerakkan kami untuk terus berkarya, berinovasi, dan memberikan dampak nyata.
                </p>
            </motion.div>
        </div>
      </section>

      {/* 2. SEJARAH */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full lg:w-1/2">
                    <TiltCard className="w-full">
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white group">
                            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000" alt="Kampus UNIS" className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="font-bold text-3xl mb-1">Sejak 1966</p>
                                <p className="text-slate-300 font-medium tracking-wide">Merawat Perjuangan.</p>
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>
                
                <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full lg:w-1/2">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><History size={28}/></div>
                        <div><h2 className="text-4xl font-extrabold text-slate-900">Sejarah Kami</h2><p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Perjalanan Panjang</p></div>
                    </div>
                    <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                        <p>Badan Eksekutif Mahasiswa Universitas Islam Syekh Yusuf (UNIS) Tangerang lahir dari semangat pergerakan mahasiswa yang menginginkan perubahan. Sejak berdiri, kami telah menjadi garda terdepan dalam menyuarakan aspirasi.</p>
                        <p>Kami bertransformasi dari masa ke masa, beradaptasi dengan tantangan zaman, namun satu hal yang tetap abadi: <strong className="text-slate-900">Komitmen kami untuk melayani</strong> dan memberikan dampak nyata bagi lingkungan sekitar.</p>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* 3. VISI & MISI (BARU DITAMBAHKAN) */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-white">Visi & Misi</h2>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Arah gerak dan tujuan strategis yang menjadi pedoman BEM UNIS.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* VISI */}
                <TiltCard className="h-full">
                    <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors h-full">
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/30"><Lightbulb size={32}/></div>
                            <h3 className="text-3xl font-extrabold mb-4 text-white">Visi Organisasi</h3>
                            <p className="text-slate-300 text-lg leading-relaxed font-light">
                                "Terwujudnya BEM UNIS sebagai poros pergerakan mahasiswa yang Inklusif, Progresif, dan Berintegritas demi terciptanya kebermanfaatan nyata bagi almamater dan bangsa."
                            </p>
                        </div>
                    </div>
                </TiltCard>

                {/* MISI */}
                <TiltCard className="h-full">
                    <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors h-full">
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-slate-900 mb-6 shadow-lg shadow-yellow-500/30"><Target size={32}/></div>
                            <h3 className="text-3xl font-extrabold mb-4 text-white">Misi Organisasi</h3>
                            <ul className="space-y-4">
                                {['Membangun tata kelola organisasi yang profesional.', 'Mewadahi minat dan bakat mahasiswa.', 'Melakukan advokasi kebijakan kampus.', 'Meningkatkan peran pengabdian masyarakat.'].map((misi, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-300 font-light">
                                        <CheckCircle2 className="text-green-400 shrink-0 mt-1" size={20}/>
                                        <span>{misi}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </TiltCard>
            </div>
         </div>
      </section>

      {/* 4. NILAI UTAMA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Nilai Utama</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">Pondasi yang memperkuat setiap langkah dan keputusan yang kami ambil.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dan etika dalam setiap tindakan organisasi.', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', border: 'hover:border-purple-200' },
                    { title: 'Kolaborasi', desc: 'Bergerak bersama, menghilangkan ego sektoral demi tujuan besar bersama.', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
                    { title: 'Kepedulian', desc: 'Peka terhadap isu sosial dan hadir sebagai solusi nyata bagi masyarakat.', icon: Heart, color: 'text-red-600', bg: 'bg-red-50', border: 'hover:border-red-200' }
                ].map((val, idx) => (
                    <TiltCard key={idx} className="h-full">
                        <div className={`bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 h-full flex flex-col items-center text-center transition-all ${val.border}`}>
                            <div className={`p-5 rounded-2xl ${val.bg} ${val.color} mb-8 shadow-sm`}><val.icon size={36}/></div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{val.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{val.desc}</p>
                        </div>
                    </TiltCard>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
};

export default About;