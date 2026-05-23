import { Suspense } from 'react';
import { getWorkshopFiles } from '@/lib/google-drive';
import { getEffectiveRole } from '@/lib/user';
import TallerMaterialView from '@/components/campus/TallerMaterialView';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ nombre: string }>;
}

export default async function TallerPage({ params }: PageProps) {
  const { nombre } = await params;
  const workshopName = decodeURIComponent(nombre);
  const role = await getEffectiveRole();

  if (!role || !workshopName) {
    notFound();
  }

  const files = await getWorkshopFiles(workshopName, role);

  return (
    <Suspense fallback={<p className="text-text-muted">Cargando material…</p>}>
      <TallerMaterialView workshopName={workshopName} files={files} />
    </Suspense>
  );
}
