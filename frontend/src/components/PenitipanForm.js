import React, { useState } from 'react';
import API from '../api';

const jenisList = ['Anjing','Kucing','Kelinci','Reptil','Lainnya'];

export default function PenitipanForm({ onSaved }) {
  const [jenis, setJenis] = useState(jenisList[0]);
  const [namaPemilik, setNamaPemilik] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [namaHewan, setNamaHewan] = useState('');
  const [waktuPenitipan, setWaktuPenitipan] = useState('');
  const [foto, setFoto] = useState(null);
  const [err, setErr] = useState('');

  function validateEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  const submit = async (ev) => {
    ev.preventDefault();
    if (!namaPemilik || !email || !waktuPenitipan) {
      setErr('Nama pemilik, email, dan waktu penitipan wajib diisi');
      return;
    }
    if (!validateEmail(email)) {
      setErr('Format email tidak valid');
      return;
    }
    if (foto && foto.size > 2*1024*1024) {
      setErr('Ukuran foto maksimal 2MB');
      return;
    }
    const d = new Date(waktuPenitipan);
    const pad = n => n.toString().padStart(2,'0');
    const formatted = `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    const form = new FormData();
    form.append('jenis_hewan', jenis);
    form.append('nama_pemilik', namaPemilik);
    form.append('email_pemilik', email);
    form.append('telepon_pemilik', telepon);
    form.append('nama_hewan', namaHewan);
    form.append('waktu_penitipan', formatted);
    if (foto) form.append('foto', foto);

    try {
      await API.post('/penitipans', form, { headers: {'Content-Type':'multipart/form-data'} });
      onSaved && onSaved();
      setErr('');
      setNamaPemilik(''); setEmail(''); setTelepon(''); setNamaHewan(''); setWaktuPenitipan(''); setFoto(null);
    } catch (e) {
      setErr(e.response?.data?.message || 'Gagal simpan');
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Tambah Penitipan</h3>
      {err && <div style={{color:'red'}}>{err}</div>}
      <div>
        <label>Jenis Hewan</label>
        <select value={jenis} onChange={e=>setJenis(e.target.value)}>
          {jenisList.map(j=> <option key={j} value={j}>{j}</option>)}
        </select>
      </div>
      <div>
        <label>Nama Pemilik</label>
        <input value={namaPemilik} onChange={e=>setNamaPemilik(e.target.value)} />
      </div>
      <div>
        <label>Email Pemilik</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div>
        <label>Telepon Pemilik</label>
        <input value={telepon} onChange={e=>setTelepon(e.target.value)} />
      </div>
      <div>
        <label>Nama Hewan</label>
        <input value={namaHewan} onChange={e=>setNamaHewan(e.target.value)} />
      </div>
      <div>
        <label>Waktu Penitipan</label>
        <input type="datetime-local" value={waktuPenitipan} onChange={e=>setWaktuPenitipan(e.target.value)} />
      </div>
      <div>
        <label>Foto (jpg/png, max 2MB)</label>
        <input type="file" accept="image/*" onChange={e=>setFoto(e.target.files[0])} />
      </div>
      <div style={{marginTop:8}}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
