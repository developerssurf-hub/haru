"use client";

import { useState } from "react";

export default function InscripcionForm({ cursos }: { cursos: any[] }) {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    curso: "",
    comentarios: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Nueva consulta de inscripción - ${formData.nombre}`);
    const body = encodeURIComponent(`Hola, mi nombre es ${formData.nombre}.

Estoy interesado/a en inscribirme.
Teléfono: ${formData.telefono}
Correo: ${formData.email}
Curso de interés: ${formData.curso}

Comentarios adicionales:
${formData.comentarios}`);
    
    const mailtoUrl = `mailto:aijaponesharuyokoi@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-xl mx-auto bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-neutral-100">
      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="text-sm font-semibold text-neutral-700">Nombre completo</label>
        <input required type="text" id="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-neutral-50" placeholder="Ej. Juan Pérez" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="telefono" className="text-sm font-semibold text-neutral-700">Teléfono (WhatsApp)</label>
          <input required type="tel" id="telefono" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-neutral-50" placeholder="+54 11 1234 5678" />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="email" className="text-sm font-semibold text-neutral-700">Email</label>
          <input required type="email" id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-neutral-50" placeholder="juan@correo.com" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="curso" className="text-sm font-semibold text-neutral-700">Curso de interés</label>
        <select required id="curso" value={formData.curso} onChange={(e) => setFormData({...formData, curso: e.target.value})} className="border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-neutral-50">
          <option value="" disabled>Seleccioná un curso</option>
          {cursos.map((c) => {
            const attributes = c.attributes || c;
            const title = attributes.Nombre || attributes.nombre || attributes.Titulo || attributes.titulo || 'Curso sin nombre';
            return (
              <option key={c.id || title} value={title}>
                {title}
              </option>
            );
          })}
          <option value="Aún no lo sé">Aún no lo sé / Quiero asesoramiento</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="comentarios" className="text-sm font-semibold text-neutral-700">Comentarios adicionales (opcional)</label>
        <textarea id="comentarios" rows={4} value={formData.comentarios} onChange={(e) => setFormData({...formData, comentarios: e.target.value})} className="border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-neutral-50 resize-none" placeholder="Contanos si tenés conocimientos previos o alguna consulta particular..." />
      </div>

      <button type="submit" className="w-full premium-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all mt-4">
        Enviar consulta por Email
      </button>
    </form>
  );
}
