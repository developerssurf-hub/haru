import { getMe, getEffectiveRole } from '@/lib/user';

export default async function Dashboard() {
  const user = await getMe();
  const username = user?.username || 'Estudiante';
  const roleName = await getEffectiveRole() || 'Alumno';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-serif text-text">Okaeri, {username}</h1>
          <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20 shadow-sm">
            {roleName}
          </span>
        </div>
        <p className="text-text-muted font-medium">Es un buen día para continuar tu camino en el japonés.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Progreso Total', value: '65%', sub: '+5% esta semana' },
          { title: 'Horas de Estudio', value: '24h', sub: 'Nivel N5' },
          { title: 'Próxima Clase', value: 'Sábado', sub: '10:00 AM' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
            <p className="text-sm text-text-muted mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-xs text-primary mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100 flex flex-col gap-6">
          <h3 className="text-xl font-serif">Continúa donde te quedaste</h3>
          <div className="aspect-video bg-zinc-100 rounded-2xl flex items-center justify-center">
            <span className="text-zinc-400 font-medium">Video del Curso</span>
          </div>
          <div>
            <h4 className="font-bold text-lg">Lección 4: Introducción a Kanji</h4>
            <p className="text-sm text-text-muted">Curso de Japonés Básico I</p>
          </div>
          <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors">
            Continuar Lección
          </button>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100">
          <h3 className="text-xl font-serif mb-6">Próximos Eventos</h3>
          <div className="space-y-4">
            {[
              { date: '21 Abr', title: 'Taller de Caligrafía', type: 'Cultura' },
              { date: '24 Abr', title: 'Examen de Vocabulario', type: 'Evaluación' },
              { date: '02 May', title: 'Webinar: Vivir en Japón', type: 'Evento' },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 items-center p-4 hover:bg-zinc-50 rounded-2xl transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <span className="text-[10px] font-bold uppercase">{event.date.split(' ')[1]}</span>
                  <span className="text-sm font-bold">{event.date.split(' ')[0]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{event.title}</h4>
                  <p className="text-xs text-text-muted">{event.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
