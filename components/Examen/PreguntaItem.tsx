'use client';

import React from 'react';
import { Pregunta, Opcion } from '../../types/examen';
import { getStrapiMedia } from '../../lib/strapi';

interface PreguntaItemProps {
  pregunta: Pregunta;
  index: number;
  seleccion: number | null;
  onSelectOption: (opcionId: number) => void;
  deshabilitar?: boolean;
  mostrarError?: boolean;
}

export function PreguntaItem({ pregunta, index, seleccion, onSelectOption, deshabilitar = false, mostrarError = false }: PreguntaItemProps) {
  const mediaData = pregunta.media?.data?.attributes || pregunta.media;
  const mediaUrl = mediaData?.url ? getStrapiMedia(mediaData.url) : null;
  const isAudio = mediaData?.mime?.startsWith('audio/');
  const isImage = mediaData?.mime?.startsWith('image/');

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 mb-6 ${mostrarError ? 'border-red-300 bg-red-50' : 'border-gray-100'}`}>
      <h3 className="text-xl font-medium text-gray-900 mb-4">
        {index + 1}. {pregunta.enunciado}
      </h3>
      
      {mediaUrl && (
        <div className="mb-6">
          {isImage && (
            <img 
              src={mediaUrl} 
              alt="Media adjunta" 
              className="max-h-64 rounded-lg object-contain bg-gray-50 p-2 border border-gray-100" 
            />
          )}
          {isAudio && (
            <audio controls className="w-full max-w-md">
              <source src={mediaUrl} type={mediaData?.mime} />
              Tu navegador no soporta el elemento de audio.
            </audio>
          )}
        </div>
      )}

      <div className="space-y-3">
        {pregunta.opciones.map((opcion: any) => {
          const isSelected = seleccion === opcion.id;
          let labelClass = "flex items-center p-4 rounded-lg border transition-colors ";
          
          if (deshabilitar) {
            labelClass += isSelected 
              ? (mostrarError ? "border-red-500 bg-red-100" : "border-green-500 bg-green-50")
              : "border-gray-200 opacity-60";
          } else {
            labelClass += isSelected
              ? "border-indigo-500 bg-indigo-50 cursor-pointer"
              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50 cursor-pointer";
          }

          return (
            <label 
              key={opcion.id}
              className={labelClass}
            >
              <input
                type="radio"
                name={`pregunta-${pregunta.id}`}
                value={opcion.id}
                checked={isSelected}
                disabled={deshabilitar}
                onChange={() => !deshabilitar && onSelectOption(opcion.id)}
                className={`w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 ${deshabilitar ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
              <span className={`ml-3 ${deshabilitar && isSelected && mostrarError ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                {opcion.texto}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
