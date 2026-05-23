'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Calendar,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
} from 'lucide-react';

export interface ProfileUser {
  id: number;
  username: string;
  email: string;
  EDAD?: number | null;
  Documento?: string | null;
  PROVINCIA?: string | null;
  CELULAR?: string | null;
  MenorDeEdad?: boolean | null;
  MAYORACARGO?: string | null;
  role?: { name: string } | null;
}

interface Props {
  user: ProfileUser;
}

export default function PerfilClient({ user }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
    EDAD: user.EDAD != null ? String(user.EDAD) : '',
    Documento: user.Documento || '',
    PROVINCIA: user.PROVINCIA || '',
    CELULAR: user.CELULAR || '',
    MenorDeEdad: Boolean(user.MenorDeEdad),
    MAYORACARGO: user.MAYORACARGO || '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.username.trim() || !formData.email.trim()) {
      setFormError('El nombre y el correo electrónico son obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        EDAD: formData.EDAD ? Number(formData.EDAD) : null,
        Documento: formData.Documento.trim() || null,
        PROVINCIA: formData.PROVINCIA.trim() || null,
        CELULAR: formData.CELULAR.trim() || null,
        MenorDeEdad: formData.MenorDeEdad,
        MAYORACARGO: formData.MAYORACARGO.trim() || null,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setFormError(result.error || 'Error al guardar los cambios.');
      } else {
        setFormSuccess('Perfil actualizado correctamente.');
        setFormData((prev) => ({ ...prev, password: '' }));
        router.refresh();
      }
    } catch {
      setFormError('Error de conexión. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400';
  const fieldWrap =
    'relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3.5 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-zinc-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
          Cuenta
        </h2>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Nombre completo *
          </label>
          <div className={fieldWrap}>
            <User className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
              className={inputClass}
              placeholder="Tu nombre"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Correo electrónico *
          </label>
          <div className={fieldWrap}>
            <Mail className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Nueva contraseña{' '}
            <span className="text-[10px] text-zinc-400 font-normal lowercase">
              (opcional)
            </span>
          </label>
          <div className={fieldWrap}>
            <Lock className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              className={inputClass}
              placeholder="Dejá en blanco para no cambiar"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Rol académico
          </label>
          <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-zinc-600">
            <Shield className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>{user.role?.name || '—'}</span>
            <span className="text-[10px] text-zinc-400 ml-auto">Solo lectura</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-zinc-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
          Datos personales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Edad
            </label>
            <div className={fieldWrap}>
              <Calendar className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
              <input
                type="number"
                min={1}
                max={120}
                value={formData.EDAD}
                onChange={(e) => setFormData((p) => ({ ...p, EDAD: e.target.value }))}
                className={inputClass}
                placeholder="Ej. 32"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Documento
            </label>
            <div className={fieldWrap}>
              <input
                type="text"
                value={formData.Documento}
                onChange={(e) => setFormData((p) => ({ ...p, Documento: e.target.value }))}
                className={inputClass}
                placeholder="DNI / pasaporte"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Provincia
          </label>
          <div className={fieldWrap}>
            <MapPin className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={formData.PROVINCIA}
              onChange={(e) => setFormData((p) => ({ ...p, PROVINCIA: e.target.value }))}
              className={inputClass}
              placeholder="Ej. Buenos Aires"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Celular
          </label>
          <div className={fieldWrap}>
            <Phone className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
            <input
              type="tel"
              value={formData.CELULAR}
              onChange={(e) => setFormData((p) => ({ ...p, CELULAR: e.target.value }))}
              className={inputClass}
              placeholder="Ej. +54 11 1234-5678"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <div>
            <span className="text-sm font-semibold text-[var(--neutral-900)] block">
              Soy menor de edad
            </span>
            <span className="text-xs text-zinc-500">
              Activá si corresponde para indicar tutor a cargo
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.MenorDeEdad}
              onChange={(e) =>
                setFormData((p) => ({ ...p, MenorDeEdad: e.target.checked }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {formData.MenorDeEdad && (
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Mayor a cargo
            </label>
            <div className={fieldWrap}>
              <User className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={formData.MAYORACARGO}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, MAYORACARGO: e.target.value }))
                }
                className={inputClass}
                placeholder="Nombre del tutor o responsable"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Guardando...
          </>
        ) : (
          'Guardar cambios'
        )}
      </button>
    </form>
  );
}
