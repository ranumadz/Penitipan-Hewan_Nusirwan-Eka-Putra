import React, { useState } from 'react';
import API from '../api';

export default function PickupModal({ penitipan, onClose, onSaved }) {
  const [waktu, setWaktu] = useState('');
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!waktu) { setErr('Waktu pengambilan wajib'); return; }
    const d = new Date(waktu);
    const pad = n => n.toString().padStart(2,'0');
    const formatted = `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    try {
      await API.put(`/penitipans/${penitipan.id}`, { waktu_pengambilan: formatted });
      onSaved && onSaved();
      onClose && onClose();
    } catch (e) {
      setErr(e.response?.data?.message || 'Gagal update');
    }
  };

  if (!penitipan) return null;
  return (
    <div style={{position:'fixed', left:0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'white', padding:20, borderRadius:6, width:500}}>
        <h3>Pengambilan - {penitipan.nomor_penitipan}</h3>
        {err && <div style={{color:'red'}}>{err}</div>}
        <div>
          <label>Waktu Pengambilan</label>
          <input type="datetime-local" onChange={e=>setWaktu(e.target.value)} />
        </div>
        <div style={{marginTop:10}}>
          <button onClick={submit}>Save</button>
          <button onClick={onClose} style={{marginLeft:8}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
