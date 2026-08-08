'use client';

import React, { useState, useEffect } from 'react';
import { Examen } from '../../types/examen';
import { PreguntaItem } from './PreguntaItem';
import { createIntento } from '../../lib/api/examenes';

interface VistaExamenProps {
  examen: Examen | any;
  intentos?: any[];
  alumnoId?: string | number;
  token?: string;
  onFinish?: (respuestas: Record<number, number>) => void;
}

export function VistaExamen({ examen, intentos = [], alumnoId, token, onFinish }: VistaExamenProps) {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [finalizado, setFinalizado] = useState(false);
  const [resultado, setResultado] = useState<{
    puntaje: number;
    correctas: number;
    incorrectas: number;
    respuestasMalas: number[];
  } | null>(null);
  const [guardando, setGuardando] = useState(false);

  const attrs = examen.attributes || examen;

  // Validation logic
  const now = new Date();
  const apertura = attrs.fecha_apertura ? new Date(attrs.fecha_apertura) : null;
  const clausura = attrs.fecha_clausura ? new Date(attrs.fecha_clausura) : null;
  const maxIntentos = attrs.max_intentos || 1;
  const cooldownHours = attrs.horas_cooldown || 24;

  const isTooEarly = apertura && now < apertura;
  const isTooLate = clausura && now > clausura;
  
  // Calculate if student is blocked by attempts or cooldown
  let isBlockedByAttempts = false;
  let cooldownEnd: Date | null = null;
  
  if (intentos.length > 0) {
    if (intentos.length >= maxIntentos) {
      isBlockedByAttempts = true;
    }
    
    // Check cooldown from the last attempt
    const lastAttemptDate = new Date(intentos[0].fecha_intento || intentos[0].attributes?.fecha_intento);
    const requiredWaitMs = cooldownHours * 60 * 60 * 1000;
    const timeSinceLast = now.getTime() - lastAttemptDate.getTime();
    
    if (timeSinceLast < requiredWaitMs) {
      cooldownEnd = new Date(lastAttemptDate.getTime() + requiredWaitMs);
    }
  }

  const handleSelectOption = (preguntaId: number, opcionId: number) => {
    if (finalizado) return;
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: opcionId
    }));
  };

  const handleTerminar = async () => {
    setFinalizado(true);
    setGuardando(true);

    let correctCount = 0;
    const malRespondidas: number[] = [];

    // Grader logic
    attrs.preguntas?.forEach((p: any) => {
      const selectedOptionId = respuestas[p.id];
      const correctOption = p.opciones?.find((o: any) => o.es_correcta);
      
      if (correctOption && selectedOptionId === correctOption.id) {
        correctCount++;
      } else {
        malRespondidas.push(p.id);
      }
    });

    const total = attrs.preguntas?.length || 0;
    const puntajeCalc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    
    setResultado({
      puntaje: puntajeCalc,
      correctas: correctCount,
      incorrectas: total - correctCount,
      respuestasMalas: malRespondidas
    });

    // Save to Strapi
    if (token && alumnoId) {
      try {
        const payload = {
          alumno: alumnoId,
          examen: examen.id || examen.documentId,
          puntaje: puntajeCalc,
          respuestas: respuestas,
          fecha_intento: new Date().toISOString()
        };
        await createIntento(payload, token);
      } catch (err) {
        console.error("Error al guardar el intento:", err);
      }
    }

    setGuardando(false);
    
    if (onFinish) {
      onFinish(respuestas);
    }
  };

  if (isTooEarly) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-yellow-50 rounded-xl p-8 border border-yellow-200">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">Examen no disponible aún</h2>
        <p className="text-yellow-700">Este examen se abrirá el {apertura.toLocaleString()}</p>
      </div>
    );
  }

  if (isTooLate) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-red-50 rounded-xl p-8 border border-red-200">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Examen cerrado</h2>
        <p className="text-red-700">La fecha límite para presentar este examen fue el {clausura.toLocaleString()}</p>
      </div>
    );
  }

  if (isBlockedByAttempts && !cooldownEnd) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-red-50 rounded-xl p-8 border border-red-200">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Límite de intentos alcanzado</h2>
        <p className="text-red-700">Has superado el máximo de {maxIntentos} intentos permitidos para este examen.</p>
      </div>
    );
  }

  if (cooldownEnd) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-orange-50 rounded-xl p-8 border border-orange-200">
        <h2 className="text-2xl font-bold text-orange-800 mb-4">Tiempo de espera activo</h2>
        <p className="text-orange-700">Debes esperar antes de volver a intentar este examen.</p>
        <p className="text-orange-700 font-medium mt-2">Podrás intentarlo de nuevo a partir de: {cooldownEnd.toLocaleString()}</p>
      </div>
    );
  }

  const preguntasContestadas = Object.keys(respuestas).length;
  const totalPreguntas = attrs.preguntas?.length || 0;
  const puedeTerminar = preguntasContestadas === totalPreguntas && totalPreguntas > 0;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 bg-indigo-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{attrs.titulo}</h1>
        {attrs.descripcion && (
          <div 
            className="text-indigo-100 mt-4 prose prose-invert"
            dangerouslySetInnerHTML={{ __html: attrs.descripcion }}
          />
        )}
      </div>

      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <span className="text-gray-600 font-medium">Progreso</span>
        <span className="text-indigo-600 font-bold">{preguntasContestadas} de {totalPreguntas} preguntas</span>
      </div>

      <div className="space-y-6">
        {attrs.preguntas?.map((pregunta: any, idx: number) => {
          const respondidaMal = resultado?.respuestasMalas.includes(pregunta.id);
          return (
            <div key={pregunta.id} className="relative">
              <PreguntaItem 
                pregunta={pregunta} 
                index={idx} 
                seleccion={respuestas[pregunta.id] || null}
                onSelectOption={(opcionId) => handleSelectOption(pregunta.id, opcionId)}
                deshabilitar={finalizado}
                mostrarError={finalizado && respondidaMal}
              />
              {finalizado && respondidaMal && (
                <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
                  Respuesta Incorrecta
                </div>
              )}
              {finalizado && !respondidaMal && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                  ¡Correcto!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!finalizado && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleTerminar}
            disabled={!puedeTerminar || guardando}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              puedeTerminar && !guardando
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {guardando ? 'Evaluando...' : 'Terminar Examen'}
          </button>
        </div>
      )}
      
      {finalizado && resultado && (
        <div className="mt-8 p-8 bg-white border border-gray-200 shadow-lg rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Resultados del Examen</h2>
          <div className="text-5xl font-black text-indigo-600 my-6">
            {resultado.puntaje}%
          </div>
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-green-600 font-medium">
              <span className="block text-2xl font-bold">{resultado.correctas}</span>
              Correctas
            </div>
            <div className="text-red-600 font-medium">
              <span className="block text-2xl font-bold">{resultado.incorrectas}</span>
              Incorrectas
            </div>
          </div>
          <p className="text-gray-600">Tus respuestas han sido registradas exitosamente.</p>
        </div>
      )}
    </div>
  );
}
