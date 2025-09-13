<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penitipan;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class PenitipanController extends Controller
{
    public function index(Request $req)
    {
        $q = Penitipan::query();

        if ($req->filled('jenis_hewan')) $q->where('jenis_hewan', $req->jenis_hewan);
        if ($req->filled('nama_pemilik')) $q->where('nama_pemilik','like','%'.$req->nama_pemilik.'%');
        if ($req->filled('nomor')) $q->where('nomor_penitipan','like','%'.$req->nomor.'%');

        $sortBy = $req->get('sortBy','created_at');
        $sortDir = $req->get('sortDir','desc');

        $q->orderBy($sortBy, $sortDir);

        $perPage = (int)$req->get('perPage', 10);
        $res = $q->paginate($perPage);

        return response()->json($res);
    }

    public function store(Request $req)
    {
        $req->validate([
            'jenis_hewan' => 'required|in:Anjing,Kucing,Kelinci,Reptil,Lainnya',
            'nama_pemilik' => 'required|string|max:255',
            'email_pemilik' => 'required|email',
            'telepon_pemilik' => 'nullable|string|max:20',
            'nama_hewan' => 'nullable|string|max:255',
            'waktu_penitipan' => 'required|string',
            'foto' => 'nullable|file|mimes:jpg,jpeg,png|max:2048'
        ]);

        $data = $req->all();
        $waktu_penitipan = Carbon::createFromFormat('d/m/Y H:i:s', $data['waktu_penitipan']);

        $datePart = $waktu_penitipan->format('ymd');
        $jenis = strtoupper(substr($data['jenis_hewan'],0,6));
        $count = Penitipan::whereDate('created_at', $waktu_penitipan->toDateString())
                ->where('jenis_hewan', $data['jenis_hewan'])
                ->count();
        $noUrut = $count + 1;
        $nomor = "{$datePart}/{$jenis}/{$noUrut}";

        $penitipan = new Penitipan();
        $penitipan->nomor_penitipan = $nomor;
        $penitipan->jenis_hewan = $data['jenis_hewan'];
        $penitipan->nama_hewan = $data['nama_hewan'] ?? null;
        $penitipan->nama_pemilik = $data['nama_pemilik'];
        $penitipan->telepon_pemilik = $data['telepon_pemilik'] ?? null;
        $penitipan->email_pemilik = $data['email_pemilik'];
        $penitipan->waktu_penitipan = $waktu_penitipan->toDateTimeString();

        if ($req->hasFile('foto')) {
            $file = $req->file('foto');
            $path = $file->store('public/photos');
            $penitipan->foto_path = $path;
        }

        $penitipan->save();

        return response()->json(['message'=>'created','data'=>$penitipan], 201);
    }

    public function show($id) {
        $p = Penitipan::findOrFail($id);
        return response()->json($p);
    }

    public function update(Request $req, $id)
    {
        $req->validate(['waktu_pengambilan' => 'required|string']);
        $p = Penitipan::findOrFail($id);
        $waktu_pengambilan = Carbon::createFromFormat('d/m/Y H:i:s', $req->waktu_pengambilan);

        $waktu_penitipan = Carbon::parse($p->waktu_penitipan);
        if ($waktu_pengambilan->lessThanOrEqualTo($waktu_penitipan)) {
            return response()->json(['message'=>'waktu_pengambilan harus setelah waktu_penitipan'], 422);
        }

        $diffSeconds = $waktu_pengambilan->diffInSeconds($waktu_penitipan);
        $hours = (int)ceil($diffSeconds / 3600);
        $biaya = 100000 * $hours;

        $p->waktu_pengambilan = $waktu_pengambilan->toDateTimeString();
        $p->biaya_penitipan = $biaya;
        $p->save();

        return response()->json(['message'=>'updated','data'=>$p]);
    }

    public function destroy($id)
    {
        $p = Penitipan::findOrFail($id);
        if ($p->foto_path) Storage::delete($p->foto_path);
        $p->delete();
        return response()->json(['message'=>'deleted']);
    }
}
