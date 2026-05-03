import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getMe() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) return null;

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    let data = await res.json();
    
    // If role is missing, try fetching the user by ID with explicit populate
    if (!data.role && data.id) {
      const userRes = await fetch(`${STRAPI_URL}/api/users/${data.id}?populate=role`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: 'no-store',
      });
      if (userRes.ok) {
        const fullUser = await userRes.json();
        data = { ...data, ...fullUser };
      }
    }

    // Writing to a file because terminal logs are hard to catch
    const fs = require('fs');
    fs.writeFileSync('debug_strapi.json', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("DEBUG: Error fetching user me:", error);
    return null;
  }
}

export async function getUserRole() {
  const user = await getMe();
  const roleName = user?.role?.name;
  console.log('DEBUG: Role name extracted:', roleName);
  return roleName || null;
}
