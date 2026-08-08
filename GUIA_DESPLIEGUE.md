# Guía de Despliegue a Producción: Refactor de Programas

Dado el refactor profundo (migración de arquitectura de Roles a Programas y ajustes directos en la base de datos de Strapi v5), el despliegue de hoy requiere pasos específicos. **Por favor, sigue esta guía en orden estricto.**

## 1. ⚠️ Respaldo (Backup) Innegociable
Antes de tocar absolutamente nada en el servidor de producción, **haz un backup completo de la base de datos productiva**. Como cambiamos la estructura fundamental de cómo se conectan los usuarios, si algo sale mal durante la migración automática de Strapi, necesitas poder volver atrás.

## 2. El "Reseteo de Permisos" de Strapi
Cuando Strapi detecte los nuevos esquemas de Programas, reseteará los permisos de seguridad (el error 500 "fantasma" que vimos en local).
*   **Acción:** Apenas se despliegue Strapi, entra al Panel de Administrador de Strapi en producción usando tu cuenta de *Superadmin*.
*   Ve a **Configuración > Roles > Directora** (y **Authenticated** si aplica).
*   Vuelve a marcar todos los permisos (Crear, Leer, Actualizar, Borrar) para `Programas` y `MapeoLecciones`.

## 3. Migración de Datos (Trabajo Manual)
Al cambiar la arquitectura, los "Programas" que creaste localmente no existirán en producción.
*   **Acción:** Una vez desplegado, tendrás que ir al panel y **crear nuevamente los Programas** (Ej: "Año I Adultos", "Particulares", etc.).
*   Todos tus estudiantes actuales en producción aparecerán en la nueva categoría: **"Sin Programa Asignado"**. 
*   Tendrás que usar el botón de editar (el lápiz) en cada uno para asignarlos a su nuevo Programa.
    *   *Nota: Al hacer esto, el sistema automáticamente les migrará el rol base a "Estudiante", limpiando el sistema viejo poco a poco.*

## 4. La Tabla de Relaciones (Join Table)
Dependiendo de la base de datos que uses en producción:
*   Si usas **PostgreSQL o MySQL**, es muy probable que Strapi cree las tablas de unión correctamente por sí solo.
*   Si usas **SQLite**, mantén el archivo `fix_join_table.js` a la mano. Si intentas asignar un alumno y te da error 500, ejecuta `node fix_join_table.js` en el servidor de producción para destrabarlo, tal como hicimos en local.

## 5. Compilación Estricta (Build)
Next.js es muy estricto en producción (`npm run build`). Si ocurre un fallo en el servidor de producción durante la fase de compilación, lee los logs de Vercel/Node: probablemente sea un error menor de TypeScript que no impedía correr en modo `dev` pero que debe ser corregido.

## 6. Variables de Entorno (.env)
Asegúrate de que en tu servidor de producción, el archivo `.env` de Next.js tenga la variable `NEXT_PUBLIC_STRAPI_URL` apuntando a tu dominio real de Strapi (ej. `https://api.tuacademia.com`) y no a `http://localhost:1337`.

---
*¡Mucho éxito con el despliegue!*
