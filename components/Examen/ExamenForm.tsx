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
  const [porcentajeAprobacion, setPorcentajeAprobacion] = useState<number>(initialData?.porcentaje_aprobacion ?? 70);

  // Extract program IDs from initialData if it exists
  const initialProgramas = initialData?.programas?.map((p: any) => p.id) || [];
  const [programasSeleccionados, setProgramasSeleccionados] = useState<number[]>(initialProgramas);

  const initialSecciones = (() => {
    if (!initialData?.preguntas || initialData.preguntas.length === 0) {
      return [{
        id: Date.now(),
        titulo: '',
        descripcion: '',
        isSection: false,
        preguntas: [{
          enunciado: '',
          tipo: 'multiple_choice',
          mediaFile: null,
          mediaPreview: null,
          existingMediaId: null,
          opciones: [
            { texto: '', es_correcta: true },
            { texto: '', es_correcta: false }
          ]
        }]
      }];
    }

    const sections: any[] = [];
    let currentSection = {
      id: Date.now() + Math.random(),
      titulo: '',
      descripcion: '',
      isSection: false,
      preguntas: [] as any[]
    };
    sections.push(currentSection);

    initialData.preguntas.forEach((p: any) => {
      if (p.seccion_titulo) {
        currentSection = {
          id: Date.now() + Math.random(),
          titulo: p.seccion_titulo,
          descripcion: p.seccion_descripcion || '',
          isSection: true,
          preguntas: []
        };
        sections.push(currentSection);
      }

      currentSection.preguntas.push({
        id: p.id,
        enunciado: p.enunciado || '',
        tipo: p.tipo || 'multiple_choice',
        mediaFile: null,
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
      });
    });

    if (sections[0].preguntas.length === 0 && sections.length > 1) {
      sections.shift();
    }

    return sections;
  })();

  const [secciones, setSecciones] = useState<any[]>(initialSecciones);

  useEffect(() => {
    async function load() {
      const data = await getProgramas(token);
      if (data?.data) {
        setProgramasDisponibles(data.data);
      }
    }
    load();
  }, [token]);

  const handleAddSeccion = () => {
    setSecciones([
      ...secciones,
      {
        id: Date.now(),
        titulo: '',
        descripcion: '',
        isSection: true,
        preguntas: []
      }
    ]);
  };

  const handleRemoveSeccion = (sIndex: number) => {
    setSecciones(secciones.filter((_, i) => i !== sIndex));
  };

  const handleSeccionChange = (sIndex: number, field: string, value: string) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex][field] = value;
    setSecciones(newSecciones);
  };

  const handleAddPregunta = (sIndex: number) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex].preguntas.push({
      enunciado: '',
      tipo: 'multiple_choice',
      mediaFile: null,
      mediaPreview: null,
      opciones: [
        { texto: '', es_correcta: true },
        { texto: '', es_correcta: false }
      ]
    });
    setSecciones(newSecciones);
  };

  const handleAddContexto = (sIndex: number) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex].preguntas.push({
      enunciado: '',
      tipo: 'contexto',
      mediaFile: null,
      mediaPreview: null,
      opciones: []
    });
    setSecciones(newSecciones);
  };


  const handleRemovePregunta = (sIndex: number, pIndex: number) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex].preguntas = newSecciones[sIndex].preguntas.filter((_: any, i: number) => i !== pIndex);
    setSecciones(newSecciones);
  };

  const handlePreguntaChange = (sIndex: number, pIndex: number, field: string, value: any) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex].preguntas[pIndex][field] = value;
    setSecciones(newSecciones);
  };

  const handleFileChange = (sIndex: number, pIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      const newSecciones = [...secciones];
      newSecciones[sIndex].preguntas[pIndex].mediaFile = file;
      newSecciones[sIndex].preguntas[pIndex].mediaPreview = preview;
      setSecciones(newSecciones);
    }
  };

  const handleAddOpcion = (sIndex: number, pIndex: number) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex].preguntas[pIndex].opciones.push({ texto: '', es_correcta: false });
    setSecciones(newSecciones);
  };

  const handleRemoveOpcion = (sIndex: number, pIndex: number, oIndex: number) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex].preguntas[pIndex].opciones = newSecciones[sIndex].preguntas[pIndex].opciones.filter((_: any, i: number) => i !== oIndex);
    setSecciones(newSecciones);
  };

  const handleOpcionChange = (sIndex: number, pIndex: number, oIndex: number, field: string, value: any) => {
    const newSecciones = [...secciones];
    newSecciones[sIndex].preguntas[pIndex].opciones[oIndex][field] = value;
    setSecciones(newSecciones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const finalPreguntas = [];

      for (const section of secciones) {
        for (let i = 0; i < section.preguntas.length; i++) {
          const p = section.preguntas[i];
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

          const isFirstOfSection = section.isSection && i === 0;

          // In Strapi v5, sending component IDs can cause 'not related to the entity' errors 
          // if not perfectly mapped. It's safer to omit the IDs so Strapi recreates them.
          finalPreguntas.push({
            enunciado: p.enunciado,
            tipo: p.tipo,
            seccion_titulo: isFirstOfSection ? section.titulo : null,
            seccion_descripcion: isFirstOfSection ? section.descripcion : null,
            media: mediaId,
            opciones: p.opciones.map((o: any) => ({
              texto: o.texto,
              es_correcta: o.es_correcta
            }))
          });
        }
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
        porcentaje_aprobacion: porcentajeAprobacion,
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Ej. Examen Final - Módulo 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clausura del Examen (Opcional)</label>
              <input
                type="datetime-local"
                value={fechaClausura}
                onChange={e => setFechaClausura(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Intentos</label>
              <input
                type="number"
                min="1"
                value={maxIntentos}
                onChange={e => setMaxIntentos(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horas de Espera (Cooldown)</label>
              <input
                type="number"
                min="0"
                value={horasCooldown}
                onChange={e => setHorasCooldown(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">% de Aprobación</label>
              <input
                type="number"
                min="0"
                max="100"
                value={porcentajeAprobacion}
                onChange={e => setPorcentajeAprobacion(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
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
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
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

      <div className="fixed bottom-10 right-10 z-50">
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-4 rounded-full font-bold text-white shadow-xl transition-all flex items-center gap-2 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 hover:shadow-2xl hover:-translate-y-1'
          }`}
        >
          {loading ? 'Guardando...' : 'Guardar Examen'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Estructura del Examen</h3>
          <button
            type="button"
            onClick={handleAddSeccion}
            className="px-4 py-2 bg-pink-50 text-pink-700 font-medium rounded-lg hover:bg-pink-100 transition-colors"
          >
            + Agregar Sección
          </button>
        </div>

        {secciones.map((section, sIndex) => (
          <div key={section.id} className={`p-6 rounded-2xl ${section.isSection ? 'bg-white border-2 border-pink-100 shadow-sm relative overflow-hidden' : 'bg-transparent px-0'}`}>
            {section.isSection && (
              <div className="absolute top-0 left-0 w-2 h-full bg-pink-500"></div>
            )}

            <div className="flex justify-between items-start mb-6">
              {section.isSection ? (
                <div className="flex-1 mr-4 space-y-3 pl-4">
                  <div>
                    <label className="block text-xs font-bold text-pink-800 uppercase tracking-wider mb-1">Título de la Sección</label>
                    <input
                      required
                      type="text"
                      value={section.titulo}
                      onChange={e => handleSeccionChange(sIndex, 'titulo', e.target.value)}
                      placeholder="Ej: Primera Parte: Comprensión Lectora"
                      className="w-full px-3 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-800 uppercase tracking-wider mb-1">Descripción (opcional)</label>
                    <textarea
                      value={section.descripcion}
                      onChange={e => handleSeccionChange(sIndex, 'descripcion', e.target.value)}
                      placeholder="Instrucciones para este bloque de preguntas..."
                      className="w-full px-3 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm text-gray-600"
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                <h4 className="font-bold text-xl text-gray-800">Preguntas Generales</h4>
              )}

              {secciones.length > 1 && (
                <button type="button" onClick={() => handleRemoveSeccion(sIndex)} className="text-red-500 hover:text-red-700 text-sm font-medium whitespace-nowrap bg-red-50 px-3 py-1.5 rounded-lg">
                  Eliminar Bloque
                </button>
              )}
            </div>

            <div className={`space-y-6 ${section.isSection ? 'pl-4' : ''}`}>
              {section.preguntas.map((p: any, pIndex: number) => (
                <div key={pIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-gray-800">
                      {p.tipo === 'contexto' ? `Contexto ${pIndex + 1}` : `Pregunta ${pIndex + 1}`}
                    </h4>
                    <button type="button" onClick={() => handleRemovePregunta(sIndex, pIndex)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Eliminar {p.tipo === 'contexto' ? 'Contexto' : 'Pregunta'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {p.tipo === 'contexto' ? 'Texto del Contexto' : 'Enunciado'}
                      </label>
                      <textarea
                        required
                        value={p.enunciado}
                        onChange={e => handlePreguntaChange(sIndex, pIndex, 'enunciado', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Archivo Multimedia (Opcional)</label>
                      <input
                        type="file"
                        accept="image/*,audio/*"
                        onChange={e => handleFileChange(sIndex, pIndex, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
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

                    {p.tipo !== 'contexto' && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Opciones de Respuesta</label>
                        <div className="space-y-3">
                          {p.opciones.map((o: any, oIndex: number) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`correcta-${sIndex}-${pIndex}`}
                                checked={o.es_correcta}
                                onChange={() => {
                                  const newSecciones = [...secciones];
                                  newSecciones[sIndex].preguntas[pIndex].opciones.forEach((opt: any, idx: number) => {
                                    opt.es_correcta = idx === oIndex;
                                  });
                                  setSecciones(newSecciones);
                                }}
                                className="w-5 h-5 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                title="Marcar como correcta"
                              />
                              <input
                                required
                                type="text"
                                value={o.texto}
                                onChange={e => handleOpcionChange(sIndex, pIndex, oIndex, 'texto', e.target.value)}
                                placeholder={`Opción ${oIndex + 1}`}
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                              />
                              {p.opciones.length > 2 && (
                                <button type="button" onClick={() => handleRemoveOpcion(sIndex, pIndex, oIndex)} className="text-gray-400 hover:text-red-500">
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddOpcion(sIndex, pIndex)}
                          className="mt-3 text-sm text-pink-600 font-medium hover:text-pink-800"
                        >
                          + Añadir Opción
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleAddPregunta(sIndex)}
                  className="flex-1 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  + Añadir Pregunta
                </button>
                <button
                  type="button"
                  onClick={() => handleAddContexto(sIndex)}
                  className="flex-1 py-3 border-2 border-dashed border-pink-200 text-pink-600 rounded-xl font-medium hover:bg-pink-50 hover:border-pink-300 transition-colors"
                >
                  + Añadir Contexto
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


    </form>
  );
}
