import React, { useEffect, useState } from 'react';
import API from '../api';
import PenitipanForm from './PenitipanForm';
import PickupModal from './PickupModal';

export default function PenitipanList(){
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({jenis:'', nama_pemilik:'', nomor:''});

  async function load(){
    const res = await API.get('/penitipans', { params: { page, perPage: 7, ...filters } });
    setData(res.data.data || res.data);
    setMeta({ last_page: res.data.last_page, current_page: res.data.current_page, total: res.data.total });
  }

  useEffect(()=>{ load(); }, [page, filters]);

  const del = async (id) => {
    if (!confirm('Hapus data?')) return;
    await API.delete(`/penitipans/${id}`);
    load();
  };

  return (
    <div>
      <div style={{display:'flex', gap:10}}>
        <input placeholder="Nomor" value={filters.nomor} onChange={e=>setFilters(f=>({...f, nomor:e.target.value}))} />
        <input placeholder="Nama pemilik" value={filters.nama_pemilik} onChange={e=>setFilters(f=>({...f, nama_pemilik:e.target.value}))} />
        <select value={filters.jenis} onChange={e=>setFilters(f=>({...f, jenis:e.target.value}))}>
          <option value="">Semua jenis</option>
          <option>Anjing</option><option>Kucing</option><option>Kelinci</option><option>Reptil</option><option>Lainnya</option>
        </select>
        <button onClick={()=>{ setPage(1); load(); }}>Filter</button>
      </div>

      <PenitipanForm onSaved={load} />

      <table className="table">
        <thead>
          <tr>
            <th>Nomor</th><th>Jenis</th><th>Nama Pemilik</th><th>Waktu Penitipan</th><th>Waktu Pengambilan</th><th>Biaya</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.nomor_penitipan}</td>
              <td>{d.jenis_hewan}</td>
              <td>{d.nama_pemilik}</td>
              <td>{d.waktu_penitipan}</td>
              <td>{d.waktu_pengambilan || '-'}</td>
              <td>{d.biaya_penitipan ? `Rp ${d.biaya_penitipan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : '-'}</td>
              <td>
                <button className="small" onClick={()=>setSelected(d)}>Pengambilan</button>
                <button className="small" onClick={()=>del(d.id)} style={{marginLeft:8}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{marginTop:8}}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {meta.current_page || 1} / {meta.last_page || 1}</span>
        <button onClick={()=>setPage(p=>p+1)} disabled={page>= (meta.last_page||1)}>Next</button>
      </div>

      {selected && <PickupModal penitipan={selected} onClose={()=>setSelected(null)} onSaved={load} />}
    </div>
  );
}
