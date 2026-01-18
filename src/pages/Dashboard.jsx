import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Trash2, Plus, LogOut, Image, Calendar, ExternalLink, Users, 
  Pencil, X, DollarSign, FileText, Download, TrendingUp, TrendingDown, 
  Shield, Wallet 
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('events'); 
  
  // Data States
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [members, setMembers] = useState([]); 
  const [finance, setFinance] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form States
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', location: '', category: '', status: 'Open', description: '', image: null, existing_image: '' });
  const [galleryForm, setGalleryForm] = useState({ caption: '', image: null, existing_image: '' });
  const [memberForm, setMemberForm] = useState({ name: '', nim: '', position: '', division: '', motto: '', image: null, existing_image: '' });
  const [financeForm, setFinanceForm] = useState({ title: '', type: 'Pemasukan', amount: '', date: '', image: null, existing_image: '' });
  const [docForm, setDocForm] = useState({ title: '', category: 'Surat Masuk', doc_number: '', date: '', file: null, existing_file: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) navigate('/login');
    fetchData();
  }, [activeTab]);

  const fetchData = () => {
    const endpoints = {
        'events': 'get_events', 'gallery': 'get_gallery', 'members': 'get_members',
        'finance': 'get_finance', 'documents': 'get_documents'
    };
    if (endpoints[activeTab]) {
        axios.get(`http://localhost/bem-api/backend/api.php?action=${endpoints[activeTab]}`)
             .then(res => {
                 if(activeTab === 'events') setEvents(res.data);
                 if(activeTab === 'gallery') setGallery(res.data);
                 if(activeTab === 'members') setMembers(res.data);
                 if(activeTab === 'finance') setFinance(res.data);
                 if(activeTab === 'documents') setDocuments(res.data);
             })
             .catch(err => console.error(err));
    }
  };

  const handleLogout = () => { localStorage.removeItem('isAdmin'); navigate('/login'); };

  const handleDelete = async (id) => {
    if(!window.confirm("Yakin hapus data ini?")) return;
    const actions = { 'events': 'delete_event', 'gallery': 'delete_gallery', 'members': 'delete_member', 'finance': 'delete_finance', 'documents': 'delete_documents' };
    await axios.post(`http://localhost/bem-api/backend/api.php?action=${actions[activeTab]}`, { id });
    fetchData();
  };

  const handleEdit = (item) => {
    setIsEditing(true); setEditId(item.id); setShowForm(true);
    if (activeTab === 'events') setEventForm({ ...item, image: null, existing_image: item.image_url });
    if (activeTab === 'gallery') setGalleryForm({ ...item, image: null, existing_image: item.image_url });
    if (activeTab === 'members') setMemberForm({ ...item, image: null, existing_image: item.image_url });
    if (activeTab === 'finance') setFinanceForm({ ...item, image: null, existing_image: item.image_url });
    if (activeTab === 'documents') setDocForm({ ...item, file: null, existing_file: item.file_url });
  };

  const resetForm = () => {
      setShowForm(false); setIsEditing(false); setEditId(null);
      setEventForm({ title: '', date: '', time: '', location: '', category: '', status: 'Open', description: '', image: null, existing_image: '' });
      setGalleryForm({ caption: '', image: null, existing_image: '' });
      setMemberForm({ name: '', nim: '', position: '', division: '', motto: '', image: null, existing_image: '' });
      setFinanceForm({ title: '', type: 'Pemasukan', amount: '', date: '', image: null, existing_image: '' });
      setDocForm({ title: '', category: 'Surat Masuk', doc_number: '', date: '', file: null, existing_file: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if(isEditing) formData.append('id', editId);

    let action = '';
    if (activeTab === 'events') {
        action = isEditing ? 'update_event' : 'add_event';
        Object.keys(eventForm).forEach(key => { if(key!=='existing_image'&&key!=='image') formData.append(key, eventForm[key]); });
        if(eventForm.image) formData.append('image', eventForm.image);
    } 
    else if (activeTab === 'finance') {
        action = isEditing ? 'update_finance' : 'add_finance';
        Object.keys(financeForm).forEach(key => { if(key!=='existing_image'&&key!=='image') formData.append(key, financeForm[key]); });
        if(financeForm.image) formData.append('image', financeForm.image);
    }
    else if (activeTab === 'documents') {
        action = isEditing ? 'update_documents' : 'add_documents';
        Object.keys(docForm).forEach(key => { if(key!=='existing_file'&&key!=='file') formData.append(key, docForm[key]); });
        if(docForm.file) formData.append('file', docForm.file);
    }
    else if (activeTab === 'gallery') {
        action = isEditing ? 'update_gallery' : 'add_gallery';
        formData.append('caption', galleryForm.caption);
        if(galleryForm.image) formData.append('image', galleryForm.image);
    }
    else if (activeTab === 'members') {
        action = isEditing ? 'update_member' : 'add_member';
        Object.keys(memberForm).forEach(key => { if(key!=='existing_image'&&key!=='image') formData.append(key, memberForm[key]); });
        if(memberForm.image) formData.append('image', memberForm.image);
    }

    await axios.post(`http://localhost/bem-api/backend/api.php?action=${action}`, formData);
    resetForm();
    fetchData();
  };

  // --- HITUNG TOTAL KAS ---
  const totalPemasukan = finance
    .filter(item => item.type === 'Pemasukan')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalPengeluaran = finance
    .filter(item => item.type === 'Pengeluaran')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalKas = totalPemasukan - totalPengeluaran;

  // --- COMPONENT HELPERS ---
  const TabButton = ({ id, icon: Icon, label }) => (
    <button 
        onClick={() => { setActiveTab(id); resetForm(); }} 
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
        <Icon size={18}/> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 pt-24 font-sans">
      <div className="container mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Shield className="text-blue-500" /> Dashboard Admin
              </h1>
              <p className="text-gray-500 text-sm mt-1">Kelola konten website dan data internal organisasi.</p>
          </div>
          <div className="flex gap-3">
             <Link to="/" className="flex items-center gap-2 bg-white/5 text-gray-300 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition text-sm font-medium">
                <ExternalLink size={16} /> Lihat Website
             </Link>
             <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition text-sm font-medium">
                <LogOut size={16} /> Logout
             </button>
          </div>
        </div>

        {/* --- MENU NAVIGASI --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10 border-b border-white/10 pb-6">
            <div className="flex flex-wrap gap-2">
                <TabButton id="events" icon={Calendar} label="Event" />
                <TabButton id="gallery" icon={Image} label="Galeri" />
                <TabButton id="members" icon={Users} label="Struktur" />
            </div>
            <div className="flex items-center gap-3 bg-neutral-900 border border-white/10 p-1.5 rounded-2xl">
                <span className="text-xs font-bold text-gray-500 px-3 uppercase tracking-wider hidden md:block">Internal:</span>
                <button onClick={() => { setActiveTab('finance'); resetForm(); }} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'finance' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    <DollarSign size={16}/> Keuangan
                </button>
                <div className="w-[1px] h-6 bg-white/10"></div>
                <button onClick={() => { setActiveTab('documents'); resetForm(); }} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'documents' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    <FileText size={16}/> Administrasi
                </button>
            </div>
        </div>

        {/* TOMBOL TAMBAH */}
        {!showForm && (
            <button onClick={() => setShowForm(true)} className="w-full md:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold flex justify-center items-center gap-3 mb-8 border border-white/10 border-dashed hover:border-blue-500/50 hover:text-blue-400 transition-all group">
                <div className="bg-blue-600 p-1 rounded-full text-white group-hover:scale-110 transition-transform"><Plus size={16} /></div> 
                Tambah Data Baru
            </button>
        )}

        {/* --- FORMULIR INPUT --- */}
        {showForm && (
          <div className="glass-panel p-8 rounded-3xl mb-10 border border-white/10 relative bg-[#0a0a0a] shadow-2xl">
            <button onClick={resetForm} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition hover:bg-red-500 hover:rotate-90"><X size={20}/></button>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                {isEditing ? <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg"><Pencil size={24}/></div> : <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><Plus size={24}/></div>} 
                {isEditing ? 'Edit Data' : 'Input Data Baru'}
                <span className="text-sm font-normal text-gray-500 ml-auto bg-white/5 px-3 py-1 rounded-full uppercase tracking-wider">{activeTab}</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
              {/* EVENT */}
              {activeTab === 'events' && (
                  <>
                    <input type="text" placeholder="Judul Event" className="input-field" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="date" className="input-field" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required />
                        <input type="text" placeholder="Waktu (08:00 - Selesai)" className="input-field" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="text" placeholder="Lokasi" className="input-field" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                        <input type="text" placeholder="Kategori" className="input-field" value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value})} />
                    </div>
                    <select className="input-field" value={eventForm.status} onChange={e => setEventForm({...eventForm, status: e.target.value})}>
                        <option value="Open">🟢 Pendaftaran Dibuka</option>
                        <option value="Closed">🔴 Pendaftaran Ditutup</option>
                    </select>
                    <textarea placeholder="Deskripsi Lengkap" className="input-field min-h-[120px]" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})}></textarea>
                    <div className="file-upload-box"><input type="file" className="w-full" onChange={(e) => setEventForm({...eventForm, image: e.target.files[0]})} /></div>
                  </>
              )}

              {/* FINANCE */}
              {activeTab === 'finance' && (
                  <>
                    <input type="text" placeholder="Keterangan Transaksi" className="input-field" value={financeForm.title} onChange={e => setFinanceForm({...financeForm, title: e.target.value})} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <select className="input-field" value={financeForm.type} onChange={e => setFinanceForm({...financeForm, type: e.target.value})}>
                            <option value="Pemasukan">🟢 Pemasukan (Income)</option>
                            <option value="Pengeluaran">🔴 Pengeluaran (Expense)</option>
                        </select>
                        <input type="number" placeholder="Jumlah (Rp)" className="input-field" value={financeForm.amount} onChange={e => setFinanceForm({...financeForm, amount: e.target.value})} required />
                    </div>
                    <input type="date" className="input-field" value={financeForm.date} onChange={e => setFinanceForm({...financeForm, date: e.target.value})} required />
                    <div className="file-upload-box"><p className="text-gray-400 text-sm mb-2">Upload Bukti / Nota</p><input type="file" onChange={(e) => setFinanceForm({...financeForm, image: e.target.files[0]})} /></div>
                  </>
              )}

              {/* DOCUMENTS */}
              {activeTab === 'documents' && (
                  <>
                    <input type="text" placeholder="Perihal / Judul Surat" className="input-field" value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <select className="input-field" value={docForm.category} onChange={e => setDocForm({...docForm, category: e.target.value})}>
                            <option value="Surat Masuk">Surat Masuk</option><option value="Surat Keluar">Surat Keluar</option><option value="SK">SK</option><option value="Proposal">Proposal</option><option value="Lainnya">Lainnya</option>
                        </select>
                        <input type="text" placeholder="Nomor Surat" className="input-field" value={docForm.doc_number} onChange={e => setDocForm({...docForm, doc_number: e.target.value})} />
                    </div>
                    <input type="date" className="input-field" value={docForm.date} onChange={e => setDocForm({...docForm, date: e.target.value})} required />
                    <div className="file-upload-box"><p className="text-gray-400 text-sm mb-2">Upload File (PDF/Doc)</p><input type="file" onChange={(e) => setDocForm({...docForm, file: e.target.files[0]})} /></div>
                  </>
              )}

              {/* GALLERY & MEMBER */}
              {activeTab === 'gallery' && (
                  <>
                     <input type="text" placeholder="Caption Foto" className="input-field" value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} required />
                     <div className="file-upload-box"><input type="file" onChange={(e) => setGalleryForm({...galleryForm, image: e.target.files[0]})} /></div>
                  </>
              )}
              {activeTab === 'members' && (
                  <>
                     <div className="grid grid-cols-2 gap-5">
                        <input type="text" placeholder="Nama Lengkap" className="input-field" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} required />
                        <input type="text" placeholder="NIM" className="input-field" value={memberForm.nim} onChange={e => setMemberForm({...memberForm, nim: e.target.value})} />
                     </div>
                     <input type="text" placeholder="Jabatan" className="input-field" value={memberForm.position} onChange={e => setMemberForm({...memberForm, position: e.target.value})} required />
                     <select className="input-field" value={memberForm.division || ''} onChange={e => setMemberForm({...memberForm, division: e.target.value})} required>
                        <option value="" disabled>Pilih Divisi</option>
                        {["BPH Inti","Dinas Kominfo","Dinas Advokasi","Dinas Minat Bakat","Dinas PSDM","Dinas Sosmas","Dinas Kastrat","Lainnya"].map(d=><option key={d} value={d}>{d}</option>)}
                     </select>
                     <div className="file-upload-box"><input type="file" onChange={(e) => setMemberForm({...memberForm, image: e.target.files[0]})} /></div>
                  </>
              )}

              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-900/50 mt-4">
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Data'}
              </button>
            </form>
          </div>
        )}

        {/* --- VIEW SECTION --- */}
        
        {/* VIEW EVENT */}
        {activeTab === 'events' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {events.map(e => (
                     <div key={e.id} className="glass-panel p-5 rounded-2xl flex justify-between items-start border border-white/10 bg-[#121212]">
                         <div className="flex gap-4">
                             <img src={e.image_url} alt="" className="w-16 h-16 rounded-lg object-cover bg-white/5 shadow-inner"/>
                             <div>
                                 <h4 className="font-bold text-base mb-1">{e.title}</h4>
                                 <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10}/> {e.date}</span>
                                    {e.status === 'Closed' ? <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-md w-fit font-bold border border-red-500/20">Closed</span> : <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-md w-fit font-bold border border-green-500/20">Open</span>}
                                 </div>
                             </div>
                         </div>
                         <div className="flex gap-2">
                             <button onClick={()=>handleEdit(e)} className="text-gray-400 hover:text-yellow-400 bg-white/5 p-2 rounded-lg"><Pencil size={16}/></button>
                             <button onClick={()=>handleDelete(e.id)} className="text-gray-400 hover:text-red-400 bg-white/5 p-2 rounded-lg"><Trash2 size={16}/></button>
                         </div>
                     </div>
                 ))}
                 {events.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">Belum ada event.</p>}
             </div>
        )}

        {/* VIEW KEUANGAN - UPDATED WITH CARDS */}
        {activeTab === 'finance' && (
            <div className="space-y-8">
                {/* RINGKASAN KAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Total Pemasukan</p>
                            <h3 className="text-2xl font-mono font-bold text-white">Rp {totalPemasukan.toLocaleString('id-ID')}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl"><TrendingUp size={24}/></div>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-rose-400 text-sm font-bold uppercase tracking-wider mb-1">Total Pengeluaran</p>
                            <h3 className="text-2xl font-mono font-bold text-white">Rp {totalPengeluaran.toLocaleString('id-ID')}</h3>
                        </div>
                        <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl"><TrendingDown size={24}/></div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                            <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Sisa Kas (Saldo)</p>
                            <h3 className="text-3xl font-mono font-bold text-white">Rp {totalKas.toLocaleString('id-ID')}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl relative z-10"><Wallet size={24}/></div>
                    </div>
                </div>

                {/* TABEL */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="p-5">Tanggal</th>
                                <th className="p-5">Keterangan</th>
                                <th className="p-5">Tipe</th>
                                <th className="p-5">Nominal</th>
                                <th className="p-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {finance.map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-5 text-gray-400">{item.date}</td>
                                    <td className="p-5 font-bold">{item.title}</td>
                                    <td className="p-5">
                                        {item.type === 'Pemasukan' ? 
                                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 w-fit"><TrendingUp size={12}/> Masuk</span> : 
                                            <span className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 w-fit"><TrendingDown size={12}/> Keluar</span>
                                        }
                                    </td>
                                    <td className={`p-5 font-mono font-bold text-base ${item.type === 'Pemasukan' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {item.type === 'Pengeluaran' ? '-' : '+'} Rp {Number(item.amount).toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-5 text-right flex justify-end gap-2">
                                        {item.image_url && <a href={item.image_url} target="_blank" className="text-blue-400 bg-blue-500/10 p-2 rounded-lg hover:bg-blue-500/20"><Image size={16}/></a>}
                                        <button onClick={() => handleEdit(item)} className="text-yellow-500 bg-yellow-500/10 p-2 rounded-lg hover:bg-yellow-500/20"><Pencil size={16}/></button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500 bg-red-500/10 p-2 rounded-lg hover:bg-red-500/20"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* VIEW ADMINISTRASI */}
        {activeTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {documents.map(doc => (
                    <div key={doc.id} className="glass-panel p-5 rounded-2xl flex items-center justify-between border border-white/10 bg-[#121212] hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${doc.category === 'Surat Masuk' ? 'bg-gradient-to-br from-green-500 to-emerald-700' : doc.category === 'Surat Keluar' ? 'bg-gradient-to-br from-blue-500 to-indigo-700' : 'bg-gradient-to-br from-purple-500 to-pink-700'}`}>
                                <FileText size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">{doc.title}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/5">{doc.category}</span>
                                    <span># {doc.doc_number || '-'}</span>
                                    <span>{doc.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {doc.file_url && <a href={doc.file_url} target="_blank" className="bg-blue-600/20 text-blue-400 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition flex justify-center"><Download size={18} /></a>}
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(doc)} className="bg-white/5 text-gray-400 p-2 rounded-lg hover:text-white"><Pencil size={18}/></button>
                                <button onClick={() => handleDelete(doc.id)} className="bg-white/5 text-gray-400 p-2 rounded-lg hover:text-red-400"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIEW LAINNYA */}
        {(activeTab === 'gallery' || activeTab === 'members') && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {activeTab === 'gallery' && gallery.map(g => (
                    <div key={g.id} className="glass-panel rounded-2xl overflow-hidden relative group border border-white/10">
                        <img src={g.image_url} className="w-full h-48 object-cover"/>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                             <button onClick={()=>handleEdit(g)} className="bg-yellow-500 text-black p-2 rounded-full"><Pencil size={16}/></button>
                             <button onClick={()=>handleDelete(g.id)} className="bg-red-500 text-white p-2 rounded-full"><Trash2 size={16}/></button>
                        </div>
                        <div className="p-3 text-xs text-center text-gray-400 truncate border-t border-white/10">{g.caption}</div>
                    </div>
                 ))}
                 {activeTab === 'members' && members.map(m => (
                    <div key={m.id} className="glass-panel p-5 rounded-2xl flex flex-col items-center gap-3 border border-white/10 bg-[#121212] relative group">
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">
                            <button onClick={()=>handleEdit(m)} className="text-yellow-500 bg-white/5 p-1 rounded"><Pencil size={14}/></button>
                            <button onClick={()=>handleDelete(m.id)} className="text-red-500 bg-white/5 p-1 rounded"><Trash2 size={14}/></button>
                        </div>
                        <img src={m.image_url} className="w-20 h-20 rounded-full object-cover border-4 border-white/5"/>
                        <div className="text-center">
                            <h4 className="font-bold">{m.name}</h4>
                            <p className="text-xs text-blue-400 font-bold uppercase">{m.position}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{m.division}</p>
                        </div>
                    </div>
                 ))}
            </div>
        )}

      </div>

      <style>{`
        .input-field { background: #1a1a1a; border: 1px solid #333; padding: 14px; border-radius: 12px; width: 100%; color: white; outline: none; transition: all 0.2s; } 
        .input-field:focus { border-color: #3b82f6; background: #222; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .file-upload-box { border: 2px dashed #333; padding: 20px; border-radius: 12px; text-align: center; cursor: pointer; transition: 0.2s; }
        .file-upload-box:hover { border-color: #555; background: #1a1a1a; }
        option { background: #121212; color: white; }
      `}</style>
    </div>
  );
};

export default Dashboard;