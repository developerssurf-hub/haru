'use client';

import { useState } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X, 
  Loader2, 
  Mail, 
  User, 
  Lock, 
  MapPin, 
  Calendar, 
  Shield, 
  ChevronDown,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_CAMPUS_ROLES } from '@/lib/roles';

const ROLE_LABELS: Record<string, string> = {
  'Año I Adultos': '1ER AÑO | Adultos',
  'Año II Adultos': '2ER AÑO | Adultos',
  'Año III Adultos': '3ER AÑO | Adultos',
  'Año IV Adultos': '4TO AÑO | Adultos',
  'Año V Adultos': '5TO AÑO | Adultos',
  'Nivel I Niños': '1ER NIVEL | Niños',
  'Nivel II Niños': '2DO NIVEL | Niños',
  Particulares: 'Particulares',
};

const STUDENT_ROLES = DEFAULT_CAMPUS_ROLES.map((name) => ({
  name,
  label: ROLE_LABELS[name] ?? name,
}));

interface UserType {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  EDAD?: number | null;
  Documento?: string | null;
  PROVINCIA?: string | null;
  LeccionInicio?: string | number | null;
  leccionInicio?: string | number | null;
  LeccionFin?: string | number | null;
  leccionFin?: string | number | null;
  role?: {
    id: number;
    name: string;
  } | null;
}

interface RoleType {
  id: number;
  name: string;
  description: string;
}

interface Props {
  initialUsers: UserType[];
  initialRoles: RoleType[];
}

export default function GestionAlumnosClient({ initialUsers, initialRoles }: Props) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [roles] = useState<RoleType[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    EDAD: '',
    Documento: '',
    PROVINCIA: '',
    roleId: '',
    activo: true,
    LeccionInicio: '',
    LeccionFin: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Helper: Refresh users list from API
  const refreshUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error('Error refreshing users:', e);
    }
  };

  const isParticularesRole = (roleId?: string) => {
    return roleId ? roles.find((r) => String(r.id) === roleId)?.name === 'Particulares' : false;
  };

  // Pre-fill fields for adding new student with a specific role
  const handleOpenAddModal = (roleName: string) => {
    const roleObj = roles.find(r => r.name === roleName);
    setFormData({
      username: '',
      email: '',
      password: '',
      EDAD: '',
      Documento: '',
      PROVINCIA: '',
      roleId: roleObj ? String(roleObj.id) : '',
      activo: true,
      LeccionInicio: '',
      LeccionFin: '',
    });
    setFormError(null);
    setFormSuccess(null);
    setIsAddModalOpen(true);
  };

  // Open Add modal without preset role (global Add button)
  const handleOpenAddNew = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      EDAD: '',
      Documento: '',
      PROVINCIA: '',
      roleId: '',
      activo: true,
      LeccionInicio: '',
      LeccionFin: '',
    });
    setFormError(null);
    setFormSuccess(null);
    setIsAddModalOpen(true);
  };

  // Pre-fill fields for editing existing student
  const handleOpenEditModal = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '', // leave empty by default
      EDAD: user.EDAD ? String(user.EDAD) : '',
      Documento: user.Documento || '',
      PROVINCIA: user.PROVINCIA || '',
      roleId: user.role ? String(user.role.id) : '',
      activo: !user.blocked,
      LeccionInicio: user.LeccionInicio ? String(user.LeccionInicio) : user.leccionInicio ? String(user.leccionInicio) : '',
      LeccionFin: user.LeccionFin ? String(user.LeccionFin) : user.leccionFin ? String(user.leccionFin) : '',
    });
    setFormError(null);
    setFormSuccess(null);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Toggle active/blocked status directly from table dropdown
  const handleToggleActive = async (user: UserType) => {
    try {
      const newBlocked = !user.blocked;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocked: newBlocked,
        }),
      });

      if (res.ok) {
        // Optimistic UI update
        setUsers(prev =>
          prev.map(u => (u.id === user.id ? { ...u, blocked: newBlocked } : u))
        );
      } else {
        const errorData = await res.json();
        alert(errorData?.error || 'Error al cambiar estado activo.');
      }
    } catch (err) {
      console.error('Error toggling active status:', err);
    }
  };

  // Handle Form Submission: CREATE
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim() || !formData.roleId) {
      setFormError('Nombre, Email, Contraseña y Rol son campos obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: Number(formData.roleId),
        blocked: !formData.activo,
        EDAD: formData.EDAD ? Number(formData.EDAD) : null,
        Documento: formData.Documento,
        PROVINCIA: formData.PROVINCIA,
        confirmed: true,
      };

      if (isParticularesRole(formData.roleId)) {
        payload.LeccionInicio = formData.LeccionInicio ? Number(formData.LeccionInicio) : null;
        payload.LeccionFin = formData.LeccionFin ? Number(formData.LeccionFin) : null;
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setFormError(result.error || 'Error al crear el alumno.');
      } else {
        setFormSuccess('Alumno registrado con éxito.');
        await refreshUsers();
        setTimeout(() => setIsAddModalOpen(false), 800);
      }
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message || 'Error de conexión.');
      } else {
        setFormError('Error de conexión.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Form Submission: EDIT
  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!selectedUser) return;
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.roleId) {
      setFormError('Nombre, Email y Rol son campos obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        username: formData.username,
        email: formData.email,
        role: Number(formData.roleId),
        blocked: !formData.activo,
        EDAD: formData.EDAD ? Number(formData.EDAD) : null,
        Documento: formData.Documento,
        PROVINCIA: formData.PROVINCIA,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      if (isParticularesRole(formData.roleId)) {
        payload.LeccionInicio = formData.LeccionInicio ? Number(formData.LeccionInicio) : null;
        payload.LeccionFin = formData.LeccionFin ? Number(formData.LeccionFin) : null;
      }

      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setFormError(result.error || 'Error al actualizar el alumno.');
      } else {
        setFormSuccess('Alumno actualizado con éxito.');
        await refreshUsers();
        setTimeout(() => setIsEditModalOpen(false), 800);
      }
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message || 'Error de conexión.');
      } else {
        setFormError('Error de conexión.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Student Deletion
  const handleDeleteStudent = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const result = await res.json();
        alert(result.error || 'Error al eliminar el alumno.');
      } else {
        await refreshUsers();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error('Error deleting student:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.Documento && user.Documento.toLowerCase().includes(term)) ||
      (user.PROVINCIA && user.PROVINCIA.toLowerCase().includes(term));
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="space-y-8 text-reveal">
      
      {/* ── Header Area ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[var(--neutral-900)] tracking-tight">
            Gestión de Alumnos
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Administra los perfiles de los estudiantes, actualiza sus contraseñas, edita campos y agrégalos a sus respectivos roles académicos.
          </p>
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────────── */}
      <div className="space-y-3 max-w-md">
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-zinc-100">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Buscar alumno por nombre, email, DNI o provincia..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none text-[var(--neutral-900)] bg-transparent placeholder-zinc-400"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Add Student Button */}
        <button
          onClick={handleOpenAddNew}
          className="w-full flex items-center justify-center gap-2 bg-[#8e004a] text-white font-semibold py-2.5 px-4 rounded-2xl hover:from-[#3e001d] hover:to-[#8e004a] transition-all transform hover:scale-105 active:scale-95 shadow-md"
          title="Agregar nuevo alumno a cualquier rol"
        >
          <Plus className="w-5 h-5" />
          Agregar Alumno
        </button>
      </div>

        

      {/* ── Role Groups ──────────────────────────────────────────── */}
      <div className="space-y-12">
        {STUDENT_ROLES.map((roleDef) => {
          // Filter students who have this specific role
          const roleStudents = filteredUsers.filter(
            u => u.role?.name === roleDef.name
          );

          return (
            <section key={roleDef.name} className="space-y-4">
              
              {/* Group Title Bar */}
              <div className="bg-[#ffecf0] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300">
                <h2 className="text-lg font-bold font-serif text-[#8e004a] uppercase tracking-wide">
                  {roleDef.label}
                </h2>
                <button
                  onClick={() => handleOpenAddModal(roleDef.name)}
                  className="w-9 h-9 rounded-full bg-[#8e004a] text-white flex items-center justify-center hover:bg-[#3e001d] transition-all transform hover:scale-105 active:scale-95 shadow-md"
                  title={`Añadir alumno a ${roleDef.label}`}
                >
                  <Plus className="w-5 h-5 font-bold" />
                </button>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100">
                        <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Nombre</th>
                        <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</th>
                        <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Edad</th>
                        <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">DNI</th>
                        <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Provincia</th>
                        <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Activo</th>
                        <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {roleStudents.length > 0 ? (
                        roleStudents.map((user) => (
                          <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="p-4">
                              <span className="font-semibold text-sm text-[var(--neutral-900)]">
                                {user.username}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-zinc-600">
                              {user.email}
                            </td>
                            <td className="p-4 text-sm text-zinc-600">
                              {user.EDAD ?? '-'}
                            </td>
                            <td className="p-4 text-sm text-zinc-600 font-mono">
                              {user.Documento ?? '-'}
                            </td>
                            <td className="p-4 text-sm text-zinc-600">
                              {user.PROVINCIA ?? '-'}
                            </td>
                            <td className="p-4">
                              <div className="relative inline-block">
                                <button
                                  onClick={() => handleToggleActive(user)}
                                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 ${
                                    !user.blocked
                                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                  }`}
                                  title="Haz clic para cambiar el estado"
                                >
                                  <span>{!user.blocked ? 'True' : 'False'}</span>
                                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(user)}
                                  className="p-2 text-zinc-500 hover:text-[var(--primary-700)] hover:bg-[var(--primary-100)] rounded-xl transition-all"
                                  title="Editar perfil de alumno"
                                >
                                  <Pencil className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteModal(user)}
                                  className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                  title="Eliminar alumno"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-zinc-400 text-sm">
                            No hay alumnos registrados en este rol.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </section>
          );
        })}
      </div>
      </div>

      {/* ── Modals Backdrop Container ─────────────────────────────── */}
      <AnimatePresence>
        
        {/* 1. ADD STUDENT MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-zinc-100 flex flex-col max-h-[90vh]"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[var(--neutral-900)]">
                    Registrar Nuevo Alumno
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Completa la información para agregar un estudiante al campus</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <form onSubmit={handleCreateStudent} className="flex-1 overflow-y-auto p-6 space-y-5">
                
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

                {/* Grid Inputs */}
                <div className="space-y-4">
                  
                  {/* Name & Email */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nombre Completo *</label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <User className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Juan Torres"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Correo Electrónico *</label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <Mail className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="email" 
                        required
                        placeholder="Ej. juan@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Contraseña *</label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="password" 
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Metadata: Edad, DNI, Provincia */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Edad</label>
                      <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                        <Calendar className="w-4 h-4 text-zinc-400 mr-2.5" />
                        <input 
                          type="number" 
                          placeholder="Ej. 32"
                          value={formData.EDAD}
                          onChange={(e) => setFormData(prev => ({ ...prev, EDAD: e.target.value }))}
                          className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">DNI (Documento)</label>
                      <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                        <Shield className="w-4 h-4 text-zinc-400 mr-2.5" />
                        <input 
                          type="text" 
                          placeholder="Ej. 1112233"
                          value={formData.Documento}
                          onChange={(e) => setFormData(prev => ({ ...prev, Documento: e.target.value }))}
                          className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Provincia</label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <MapPin className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="text" 
                        placeholder="Ej. Buenos aires"
                        value={formData.PROVINCIA}
                        onChange={(e) => setFormData(prev => ({ ...prev, PROVINCIA: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Rol / Año Académico *</label>
                    <select
                      required
                      value={formData.roleId}
                      onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[var(--neutral-900)] outline-none focus:border-[var(--primary-500)] focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Selecciona un rol académico</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Conditional: Leccion Inicio & Fin for Particulares role */}
                  {isParticularesRole(formData.roleId) && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Lección Inicio</label>
                        <div className="relative flex items-center bg-white border border-blue-200 rounded-xl p-3 focus-within:border-blue-500 focus-within:bg-blue-50 transition-all">
                          <input 
                            type="number" 
                            placeholder="Ej. 1"
                            value={formData.LeccionInicio}
                            onChange={(e) => setFormData(prev => ({ ...prev, LeccionInicio: e.target.value }))}
                            className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Lección Fin</label>
                        <div className="relative flex items-center bg-white border border-blue-200 rounded-xl p-3 focus-within:border-blue-500 focus-within:bg-blue-50 transition-all">
                          <input 
                            type="number" 
                            placeholder="Ej. 10"
                            value={formData.LeccionFin}
                            onChange={(e) => setFormData(prev => ({ ...prev, LeccionFin: e.target.value }))}
                            className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <div>
                      <span className="text-sm font-semibold text-[var(--neutral-900)] block">Estado Activo</span>
                      <span className="text-xs text-zinc-500">Permite al estudiante acceder a la plataforma</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.activo}
                        onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#8e004a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3e001d] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Registrando...</span>
                      </>
                    ) : (
                      <span>Registrar Alumno</span>
                    )}
                  </button>
                </div>

              </form>

            </motion.div>

          </div>
        )}

        {/* 2. EDIT STUDENT MODAL */}
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-zinc-100 flex flex-col max-h-[90vh]"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[var(--neutral-900)]">
                    Editar Alumno
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Modificando el perfil de <span className="font-semibold text-zinc-700">{selectedUser.username}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <form onSubmit={handleEditStudent} className="flex-1 overflow-y-auto p-6 space-y-5">
                
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

                {/* Grid Inputs */}
                <div className="space-y-4">
                  
                  {/* Name & Email */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nombre Completo *</label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <User className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Juan Torres"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Correo Electrónico *</label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <Mail className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="email" 
                        required
                        placeholder="Ej. juan@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Password (Optional in Edit) */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Nueva Contraseña <span className="text-[10px] text-zinc-400 font-normal lowercase">(dejar en blanco para no cambiar)</span>
                    </label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="password" 
                        placeholder="Ingresa nueva contraseña si deseas cambiarla"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Metadata: Edad, DNI, Provincia */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Edad</label>
                      <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                        <Calendar className="w-4 h-4 text-zinc-400 mr-2.5" />
                        <input 
                          type="number" 
                          placeholder="Ej. 32"
                          value={formData.EDAD}
                          onChange={(e) => setFormData(prev => ({ ...prev, EDAD: e.target.value }))}
                          className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">DNI (Documento)</label>
                      <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                        <Shield className="w-4 h-4 text-zinc-400 mr-2.5" />
                        <input 
                          type="text" 
                          placeholder="Ej. 1112233"
                          value={formData.Documento}
                          onChange={(e) => setFormData(prev => ({ ...prev, Documento: e.target.value }))}
                          className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Provincia</label>
                    <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-[var(--primary-500)] focus-within:bg-white transition-all">
                      <MapPin className="w-4 h-4 text-zinc-400 mr-2.5" />
                      <input 
                        type="text" 
                        placeholder="Ej. Buenos aires"
                        value={formData.PROVINCIA}
                        onChange={(e) => setFormData(prev => ({ ...prev, PROVINCIA: e.target.value }))}
                        className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Rol / Año Académico *</label>
                    <select
                      required
                      value={formData.roleId}
                      onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[var(--neutral-900)] outline-none focus:border-[var(--primary-500)] focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Selecciona un rol académico</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Conditional: Leccion Inicio & Fin for Particulares role */}
                  {isParticularesRole(formData.roleId) && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Lección Inicio</label>
                        <div className="relative flex items-center bg-white border border-blue-200 rounded-xl p-3 focus-within:border-blue-500 focus-within:bg-blue-50 transition-all">
                          <input 
                            type="number" 
                            placeholder="Ej. 1"
                            value={formData.LeccionInicio}
                            onChange={(e) => setFormData(prev => ({ ...prev, LeccionInicio: e.target.value }))}
                            className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Lección Fin</label>
                        <div className="relative flex items-center bg-white border border-blue-200 rounded-xl p-3 focus-within:border-blue-500 focus-within:bg-blue-50 transition-all">
                          <input 
                            type="number" 
                            placeholder="Ej. 10"
                            value={formData.LeccionFin}
                            onChange={(e) => setFormData(prev => ({ ...prev, LeccionFin: e.target.value }))}
                            className="w-full bg-transparent text-sm outline-none text-[var(--neutral-900)] placeholder-zinc-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <div>
                      <span className="text-sm font-semibold text-[var(--neutral-900)] block">Estado Activo</span>
                      <span className="text-xs text-zinc-500">Permite al estudiante acceder a la plataforma</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.activo}
                        onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#8e004a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3e001d] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <span>Guardar Cambios</span>
                    )}
                  </button>
                </div>

              </form>

            </motion.div>

          </div>
        )}

        {/* 3. DELETE CONFIRMATION MODAL */}
        {isDeleteModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-zinc-100 flex flex-col"
            >
              
              {/* Content */}
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-serif text-[var(--neutral-900)]">
                    ¿Eliminar Alumno?
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Estás a punto de eliminar a <span className="font-semibold text-zinc-700">{selectedUser.username}</span> del campus. Esta acción es permanente y revocará todo acceso.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 bg-white hover:bg-zinc-50 transition-colors"
                >
                  No, mantener
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStudent}
                  disabled={submitting}
                  className="w-full bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <span>Sí, eliminar</span>
                  )}
                </button>
              </div>

            </motion.div>

          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
