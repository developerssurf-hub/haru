'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchStrapi } from '@/lib/strapi';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

type BlockType = 'paragraph' | 'heading' | 'image';

interface Block {
  id: string;
  type: BlockType;
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  imageFile?: File | null;
  imagePreview?: string | null;
  existingImageObject?: any;
}

export default function BlogForm({ blogId, token }: { blogId?: string, token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tag, setTag] = useState('blog');

  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [miniaturaFile, setMiniaturaFile] = useState<File | null>(null);

  // Nuevo estado para los bloques
  const [blocks, setBlocks] = useState<Block[]>([
    { id: crypto.randomUUID(), type: 'paragraph', text: '' }
  ]);

  useEffect(() => {
    if (blogId) {
      loadBlog();
    }
  }, [blogId]);

  const loadBlog = async () => {
    try {
      const res = await fetchStrapi(`blogs/${blogId}`, 'populate=*', token);
      const post = res?.data;
      if (post) {
        setTitle(post.title || '');
        setSlug(post.Slug || '');
        setDescripcion(post.Descripcion || '');
        setTag(post.Tag || 'blog');

        // Parsear bloques de Strapi
        if (post.Contenido && Array.isArray(post.Contenido)) {
          const parsedBlocks: Block[] = post.Contenido.map((block: any) => {
            if (block.type === 'paragraph') {
              const text = block.children?.map((c: any) => c.text).join('') || '';
              return { id: crypto.randomUUID(), type: 'paragraph', text };
            }
            if (block.type === 'heading') {
              const text = block.children?.map((c: any) => c.text).join('') || '';
              return { id: crypto.randomUUID(), type: 'heading', level: block.level || 2, text };
            }
            if (block.type === 'image') {
              return {
                id: crypto.randomUUID(),
                type: 'image',
                existingImageObject: block.image
              };
            }
            return null;
          }).filter(Boolean);

          if (parsedBlocks.length > 0) {
            setBlocks(parsedBlocks);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar el artículo.');
    }
  };

  const uploadFileReturnObject = async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (!res.ok) throw new Error('Error subiendo archivo');
    const data = await res.json();
    return data[0]; // Devuelve el objeto completo (id, url, name, etc)
  };

  const uploadFile = async (file: File) => {
    const data = await uploadFileReturnObject(file);
    return data?.id;
  };

  const handleAddBlock = (type: BlockType) => {
    setBlocks([...blocks, { id: crypto.randomUUID(), type, text: '', level: 2 }]);
  };

  const handleRemoveBlock = (id: string) => {
    if (blocks.length === 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleBlockChange = (id: string, field: keyof Block, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let portadaId = undefined;
      let miniaturaId = undefined;

      if (portadaFile) portadaId = await uploadFile(portadaFile);
      if (miniaturaFile) miniaturaId = await uploadFile(miniaturaFile);

      // Procesar bloques de contenido
      const finalStrapiBlocks = [];
      for (const b of blocks) {
        if (b.type === 'paragraph') {
          if (!b.text?.trim()) continue; // saltar vacíos
          finalStrapiBlocks.push({
            type: "paragraph",
            children: [{ type: "text", text: b.text }]
          });
        } else if (b.type === 'heading') {
          if (!b.text?.trim()) continue;
          finalStrapiBlocks.push({
            type: "heading",
            level: b.level || 2,
            children: [{ type: "text", text: b.text }]
          });
        } else if (b.type === 'image') {
          let imageObj = b.existingImageObject;
          if (b.imageFile) {
            imageObj = await uploadFileReturnObject(b.imageFile);
          }
          if (imageObj) {
            finalStrapiBlocks.push({
              type: "image",
              image: imageObj
            });
          }
        }
      }

      const payload = {
        data: {
          title,
          Slug: slug,
          Descripcion: descripcion,
          Tag: tag,
          Contenido: finalStrapiBlocks,
          ...(portadaId && { Portada: portadaId }),
          ...(miniaturaId && { Miniatura: miniaturaId })
        }
      };

      const url = blogId ? `${API_URL}/api/blogs/${blogId}` : `${API_URL}/api/blogs`;
      const method = blogId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error?.message || 'Error al guardar el artículo');
      }

      alert('Artículo guardado exitosamente');
      router.push('/campus/gestion-blog');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-8 space-y-8 pb-32">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {blogId ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                required
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 outline-none"
                placeholder="Ej. Los 3 alfabetos de Japón"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL amigable)</label>
              <input
                required
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 outline-none"
                placeholder="ej-los-3-alfabetos"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Entrada (Tag)</label>
            <select
              value={tag}
              onChange={e => setTag(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 outline-none bg-white"
            >
              <option value="blog">Bitácora (General)</option>
              <option value="gramatica">Consejos Gramaticales</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
            <textarea
              required
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 outline-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portada (Banner Principal)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setPortadaFile(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miniatura (Cards)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setMiniaturaFile(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
          Contenido del Artículo
        </h3>

        <div className="space-y-6">
          {blocks.map((block, index) => (
            <div key={block.id} className="relative group bg-gray-50 border border-gray-200 p-4 rounded-lg flex gap-4">
              {/* Controles del Bloque */}
              <div className="flex flex-col gap-1 items-center justify-center shrink-0 w-8 opacity-50 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="hover:text-pink-600 disabled:opacity-30">
                  ↑
                </button>
                <div className="text-xs font-bold text-gray-400 my-1">{index + 1}</div>
                <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="hover:text-pink-600 disabled:opacity-30">
                  ↓
                </button>
                {blocks.length > 1 && (
                  <button type="button" onClick={() => handleRemoveBlock(block.id)} className="text-red-500 hover:text-red-700 mt-2">
                    ✕
                  </button>
                )}
              </div>

              {/* Render del Bloque */}
              <div className="flex-1 min-w-0">
                {block.type === 'paragraph' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Párrafo</label>
                    <textarea
                      value={block.text || ''}
                      onChange={e => handleBlockChange(block.id, 'text', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 outline-none"
                      rows={3}
                      placeholder="Escribe tu párrafo aquí..."
                    />
                  </div>
                )}
                {block.type === 'heading' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Título</label>
                    <div className="flex gap-2">
                      <select
                        value={block.level || 2}
                        onChange={e => handleBlockChange(block.id, 'level', parseInt(e.target.value))}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 outline-none bg-white font-bold"
                      >
                        <option value={2}>H2 (Subtítulo principal)</option>
                        <option value={3}>H3 (Subtítulo secundario)</option>
                        <option value={4}>H4 (Menor)</option>
                      </select>
                      <input
                        type="text"
                        value={block.text || ''}
                        onChange={e => handleBlockChange(block.id, 'text', e.target.value)}
                        className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 outline-none font-bold ${
                          block.level === 2 ? 'text-xl' : block.level === 3 ? 'text-lg' : 'text-base'
                        }`}
                        placeholder="Escribe el título aquí..."
                      />
                    </div>
                  </div>
                )}
                {block.type === 'image' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Imagen</label>
                    
                    {block.existingImageObject ? (
                      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
                        <img 
                          src={block.existingImageObject.url} 
                          alt="preview" 
                          className="h-20 w-32 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Imagen actual en el servidor</p>
                          <button 
                            type="button" 
                            onClick={() => handleBlockChange(block.id, 'existingImageObject', null)}
                            className="text-xs text-red-500 hover:underline mt-1"
                          >
                            Reemplazar imagen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {block.imagePreview && (
                          <div className="mb-3">
                            <img src={block.imagePreview} alt="Preview" className="h-40 w-auto rounded border shadow-sm" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            handleBlockChange(block.id, 'imageFile', file);
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => handleBlockChange(block.id, 'imagePreview', e.target?.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              handleBlockChange(block.id, 'imagePreview', null);
                            }
                          }}
                          className="w-full bg-white px-3 py-2 border rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Botones Añadir */}
          <div className="flex justify-center gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleAddBlock('paragraph')}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Párrafo
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('heading')}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Título
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('image')}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Imagen
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 z-50">
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-4 rounded-full font-bold text-white shadow-xl transition-all flex items-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 hover:shadow-2xl hover:-translate-y-1'
            }`}
        >
          {loading ? 'Guardando...' : 'Guardar Artículo'}
        </button>
      </div>
    </form>
  );
}
