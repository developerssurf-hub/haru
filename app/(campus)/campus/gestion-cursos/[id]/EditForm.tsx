'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStrapiMedia } from '@/lib/strapi';

export default function EditForm({ curso }: { curso: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const attributes = curso.attributes || curso;
  const [activo, setActivo] = useState<boolean>(attributes.Activo !== false);

  const router = useRouter();

  const docId = curso.documentId || curso.id;
  const imagenData = attributes.Portada || attributes.Imagen;
  const rawUrl = imagenData?.url || imagenData?.data?.attributes?.url;
  const currentImageUrl = rawUrl ? getStrapiMedia(rawUrl) : null;

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
        if (!uploadRes.ok) throw new Error(uploadResult.error || 'Error al subir nueva imagen');
        if (Array.isArray(uploadResult) && uploadResult.length > 0) {
          imageId = uploadResult[0].id;
        }
      }

      data.Activo = activo;
      if (imageId) {
        data.Portada = imageId;
      }

      const res = await fetch('/api/strapi/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: 'cursos', id: docId, data }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Error al guardar en Strapi');
      }

      router.push('/campus/gestion-cursos');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Nombre del Curso
        </label>
        <input
          name="Nombre"
          defaultValue={attributes.Nombre || attributes.nombre || attributes.Titulo || attributes.titulo || ''}
          required
          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
          placeholder="Ej: Japonés para niños"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Inicio / Fecha</label>
        <input
          name="Inicio"
          defaultValue={attributes.Inicio || ''}
          required
          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
          placeholder="Ej: Marzo 2027"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Descripción</label>
        <textarea
          name="Descripcion"
          defaultValue={attributes.Descripcion || ''}
          required
          rows={3}
          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
          placeholder="Descripción breve del curso..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Imagen</label>
        {currentImageUrl && !imageFile && (
          <div className="mb-2">
            <p className="text-xs text-zinc-500 mb-1">Imagen actual:</p>
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-zinc-200">
              <img src={currentImageUrl} alt="Imagen actual" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-primary/50 transition-colors text-sm"
        />
        <p className="text-xs text-zinc-500">Sube una nueva imagen si deseas reemplazar la actual.</p>
      </div>

      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          className="w-5 h-5 rounded text-primary focus:ring-primary border-zinc-300"
        />
        <label className="text-sm font-bold text-zinc-700">Curso Activo</label>
      </div>

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
          className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold hover:bg-[var(--primary-700)] transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
