
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateForm({ type, endpoint }: { type: string, endpoint: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activo, setActivo] = useState<boolean>(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      let imageId = null;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('files', imageFile);
        const uploadRes = await fetch('/api/strapi/upload', {
          method: 'POST',
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.error || 'Error al subir imagen');
        if (Array.isArray(uploadResult) && uploadResult.length > 0) {
          imageId = uploadResult[0].id;
        }
      }

      if (type === 'curso') {
        data.Activo = activo;
        if (imageId) {
          data.Portada = imageId;
        }
      }

      const res = await fetch('/api/strapi/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, data }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Error al guardar en Strapi');
      }

      router.push('/campus');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const availableRoles = [
    'Todos',
    'Año I Adultos',
    'Año II Adultos',
    'Año III Adultos',
    'Año IV Adultos',
    'Nivel I Niños',
    'Nivel II Niños'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          {type === 'curso' ? 'Nombre del Curso' : 'Título'}
        </label>
        <input
          name={type === 'curso' ? 'Nombre' : 'Titulo'}
          required
          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={type === 'curso' ? 'Ej: Japonés para niños' : 'Ej: Clase de Caligrafía Japonesa'}
        />
      </div>

      {type === 'clase' && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Link de Zoom / Google Meet</label>
          <input
            name="Link"
            required
            className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="https://zoom.us/j/..."
          />
        </div>
      )}

      {type === 'anuncio' && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Contenido</label>
          <textarea
            name="Contenido"
            required
            rows={4}
            className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Escribe el mensaje o pega un link importante..."
          />
        </div>
      )}

      {type === 'evento' && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Descripción Corta</label>
          <input
            name="DescripcionCorta"
            required
            className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="Ej: Aprende los trazos básicos..."
          />
        </div>
      )}

      {type === 'juego' && (
        <>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Descripción</label>
            <textarea
              name="Descripcion"
              required
              rows={3}
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Descripción del juego..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Enlace o Código Iframe (Enable)</label>
            <textarea
              name="Enable"
              required
              rows={3}
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
              placeholder='https://wordwall.net/... o <iframe src="...">'
            />
          </div>
        </>
      )}

      {type === 'curso' && (
        <>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Inicio / Fecha</label>
            <input
              name="Inicio"
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Ej: Marzo 2027"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Descripción</label>
            <textarea
              name="Descripcion"
              required
              rows={3}
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Descripción breve del curso..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary border-zinc-300"
            />
            <label className="text-sm font-bold text-zinc-700">Curso Activo</label>
          </div>
        </>
      )}



      {type !== 'evento' && type !== 'juego' && type !== 'curso' && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Dirigido a</label>
          <select 
            name="Dirigido" 
            className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors appearance-none"
          >
            {availableRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-4 border border-zinc-200 rounded-xl font-bold text-zinc-500 hover:bg-zinc-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar ahora'}
        </button>
      </div>
    </form>
  );
}
