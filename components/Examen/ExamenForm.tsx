'use client';

import React, { useState, useEffect } from 'react';
import { createExamen, getProgramas, updateExamen } from '../../lib/api/examenes';
import { uploadStrapi, getStrapiMedia } from '../../lib/strapi';
import { useRouter } from 'next/navigation';

export function ExamenForm({ token, initialData, examenId }: { token: string, initialData?: any, examenId?: string | number }) {
  const router = useRouter();
  const [programasDisponibles, setProgramasDisponibles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || '');
  
  // Format dates for datetime-local input
  const formatForInput = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 16);
  };

  const [fechaApertura, setFechaApertura] = useState(formatForInput(initialData?.fecha_apertura));
  const [fechaClausura, setFechaClausura] = useState(formatForInput(initialData?.fecha_clausura));
  const [maxIntentos, setMaxIntentos] = useState<number>(initialData?.max_intentos ?? 1);
  const [horasCooldown, setHorasCooldown] = useState<number>(initialData?.horas_cooldown ?? 24);

  // Extract program IDs from initialData if it exists
  const initialProgramas = initialData?.programas?.map((p: any) => p.id) || [];
  const [programasSeleccionados, setProgramasSeleccionados] = useState<number[]>(initialProgramas);
  
  // Format preguntas from initialData if exists
  const initialPreguntas = initialData?.preguntas?.length > 0 ? initialData.preguntas.map((p: any) => ({
    id: p.id,
    enunciado: p.enunciado || '',
    tipo: p.tipo || 'multiple_choice',
    mediaFile: null,
    // Use the getStrapiMedia to get the full URL
    mediaPreview: p.media ? getStrapiMedia(p.media.url || p.media.attributes?.url) : null,
    existingMediaId: p.media ? p.media.id : null,
    opciones: p.opciones?.length > 0 ? p.opciones.map((o: any) => ({
      id: o.id,
      texto: o.texto || '',
      es_correcta: !!o.es_correcta
    })) : [
      { texto: '', es_correcta: true },
      { texto: '', es_correcta: false }
    ]
  })) : [
    {
      enunciado: '',
      tipo: 'multiple_choice',
      mediaFile: null,
      mediaPreview: null,
      existingMediaId: null,
      opciones: [
        { texto: '', es_correcta: true },
        { texto: '', es_correcta: false }
      ]
    }
  ];

  const [preguntas, setPreguntas] = useState<any[]>(initialPreguntas);

  useEffect(() => {
    async function load() {
      const data = await getProgramas(token);
      if (data?.data) {
        setProgramasDisponibles(data.data);
      }
    }
    load();
  }, [token]);

  const handleAddPregunta = () => {
    setPreguntas([
      ...preguntas,
      {
        enunciado: '',
        tipo: 'multiple_choice',
        mediaFile: null,
        mediaPreview: null,
        opciones: [
          { texto: '', es_correcta: true },
          { texto: '', es_correcta: false }
        ]
      }
    ]);
  };

  const handleRemovePregunta = (pIndex: number) => {
    setPreguntas(preguntas.filter((_, i) => i !== pIndex));
  };

  const handlePreguntaChange = (pIndex: number, field: string, value: any) => {
    const newPreguntas = [...preguntas];
    newPreguntas[pIndex][field] = value;
    setPreguntas(newPreguntas);
  };

  const handleFileChange = (pIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      const newPreguntas = [...preguntas];
      newPreguntas[pIndex].mediaFile = file;
      newPreguntas[pIndex].mediaPreview = preview;
      setPreguntas(newPreguntas);
    }
  };

  const handleAddOpcion = (pIndex: number) => {
    const newPreguntas = [...preguntas];
    newPreguntas[pIndex].opciones.push({ texto: '', es_correcta: false });
    setPreguntas(newPreguntas);
  };

  const handleRemoveOpcion = (pIndex: number, oIndex: number) => {
    const newPreguntas = [...preguntas];
    newPreguntas[pIndex].opciones = newPreguntas[pIndex].opciones.filter((_: any, i: number) => i !== oIndex);
    setPreguntas(newPreguntas);
  };

  const handleOpcionChange = (pIndex: number, oIndex: number, field: string, value: any) => {
    const newPreguntas = [...preguntas];
    newPreguntas[pIndex].opciones[oIndex][field] = value;
    setPreguntas(newPreguntas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const finalPreguntas = [];

      for (const p of preguntas) {
        let mediaId = p.existingMediaId;
        
        if (p.mediaFile) {
          const formData = new FormData();
          formData.append('files', p.mediaFile);
          const uploadRes = await uploadStrapi(formData, token);
          if (uploadRes && uploadRes.length > 0) {
            mediaId = uploadRes[0].id;
          } else {
            throw new Error('Error al subir el archivo multimedia de la pregunta.');
          }
        }

        // In Strapi v5, sending component IDs can cause 'not related to the entity' errors 
        // if not perfectly mapped. It's safer to omit the IDs so Strapi recreates them.
        finalPreguntas.push({
          enunciado: p.enunciado,
          tipo: p.tipo,
          media: mediaId,
          opciones: p.opciones.map((o: any) => ({
            texto: o.texto,
            es_correcta: o.es_correcta
          }))
        });
      }

      const payload = {
        titulo,
        descripcion,
        programas: programasSeleccionados,
        preguntas: finalPreguntas,
        fecha_apertura: fechaApertura ? new Date(fechaApertura).toISOString() : null,
        fecha_clausura: fechaClausura ? new Date(fechaClausura).toISOString() : null,
        max_intentos: maxIntentos,
        horas_cooldown: horasCooldown,
        publishedAt: new Date().toISOString(),
      };

      let res;
      if (examenId) {
        res = await updateExamen(examenId, payload, token);
      } else {
        res = await createExamen(payload, token);
      }

      if (res?.data) {
        alert(examenId ? 'Examen actualizado exitosamente!' : 'Examen creado exitosamente!');
        router.push('/campus/gestion-examenes'); // Go back to the list
      } else {
        const strapiError = res?.error?.message || res?.error?.details || JSON.stringify(res?.error) || 'Error desconocido';
        throw new Error(`Error del servidor: ${strapiError}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {examenId ? 'Editar Examen' : 'Crear Nuevo Examen'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del Examen</label>
            <input 
              required
              type="text" 
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ej. Examen Final - Módulo 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apertura del Examen (Opcional)</label>
              <input 
                type="datetime-local" 
                value={fechaApertura}
                onChange={e => setFechaApertura(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clausura del Examen (Opcional)</label>
              <input 
                type="datetime-local" 
                value={fechaClausura}
                onChange={e => setFechaClausura(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Intentos</label>
              <input 
                type="number"
                min="1"
                value={maxIntentos}
                onChange={e => setMaxIntentos(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horas de Espera (Cooldown)</label>
              <input 
                type="number"
                min="0"
                value={horasCooldown}
                onChange={e => setHorasCooldown(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asignar a Programas</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border rounded-lg p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
              {programasDisponibles.map(prog => (
                <label key={prog.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={programasSeleccionados.includes(prog.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProgramasSeleccionados([...programasSeleccionados, prog.id]);
                      } else {
                        setProgramasSeleccionados(programasSeleccionados.filter(id => id !== prog.id));
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    {prog.Nombre || prog.attributes?.Nombre || `Programa ${prog.id}`}
                  </span>
                </label>
              ))}
            </div>
            {programasDisponibles.length === 0 && (
              <p className="text-sm text-gray-500 italic mt-2">No hay programas disponibles o cargando...</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Preguntas</h3>
        
        {preguntas.map((p, pIndex) => (
          <div key={pIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg text-gray-800">Pregunta {pIndex + 1}</h4>
              {preguntas.length > 1 && (
                <button type="button" onClick={() => handleRemovePregunta(pIndex)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                  Eliminar Pregunta
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enunciado</label>
                <textarea 
                  required
                  value={p.enunciado}
                  onChange={e => handlePreguntaChange(pIndex, 'enunciado', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo Multimedia (Opcional)</label>
                <input 
                  type="file" 
                  accept="image/*,audio/*"
                  onChange={e => handleFileChange(pIndex, e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {p.mediaPreview && (
                  <div className="mt-2">
                    {p.mediaFile?.type.startsWith('image/') ? (
                      <img src={p.mediaPreview} alt="Preview" className="h-32 rounded-lg object-cover" />
                    ) : (
                      <audio controls src={p.mediaPreview} className="mt-2" />
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Opciones de Respuesta</label>
                <div className="space-y-3">
                  {p.opciones.map((o: any, oIndex: number) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name={`correcta-${pIndex}`}
                        checked={o.es_correcta}
                        onChange={() => {
                          const newPreguntas = [...preguntas];
                          newPreguntas[pIndex].opciones.forEach((opt: any, idx: number) => {
                            opt.es_correcta = idx === oIndex;
                          });
                          setPreguntas(newPreguntas);
                        }}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        title="Marcar como correcta"
                      />
                      <input 
                        required
                        type="text"
                        value={o.texto}
                        onChange={e => handleOpcionChange(pIndex, oIndex, 'texto', e.target.value)}
                        placeholder={`Opción ${oIndex + 1}`}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      {p.opciones.length > 2 && (
                        <button type="button" onClick={() => handleRemoveOpcion(pIndex, oIndex)} className="text-gray-400 hover:text-red-500">
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => handleAddOpcion(pIndex)}
                  className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800"
                >
                  + Añadir Opción
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          type="button" 
          onClick={handleAddPregunta}
          className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          + Agregar Nueva Pregunta
        </button>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button 
          type="submit" 
          disabled={loading}
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
          }`}
        >
          {loading ? 'Guardando Examen...' : 'Guardar Examen'}
        </button>
      </div>
    </form>
  );
}
