import type { StoreAdvisor } from "@/lib/store-types";

/**
 * Respuesta del endpoint público `GET /stores/{slug}/personal` del backend.
 * Espejo de `PersonalMemberResponse` (Java) — solo expone datos visibles
 * para que un cliente contacte al asesor.
 */
export type AdvisorApiResponse = {
  id: number;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  active: boolean;
  sortOrder: number;
};

/**
 * Mapea un asesor del backend al shape del storefront. Solo conserva
 * miembros activos. Si el nombre viene vacío, cae a "Asesor" para no
 * romper la UI; si falta la foto, usa un avatar de picsum estable por id.
 *
 * Es seguro llamarlo desde el cliente (no toca I/O ni hace fetch).
 */
export function mapAdvisors(data: AdvisorApiResponse[]): StoreAdvisor[] {
  return data
    .filter((item) => item.active)
    .map((entry) => ({
      sortOrder: Number(entry.sortOrder ?? 0),
      advisor: {
        id: String(entry.id),
        name: entry.name?.trim() || "Asesor",
        photoSrc:
          entry.photoUrl?.trim() ||
          `https://picsum.photos/seed/rs-asesor-api-${entry.id}/240/240`,
        photoAlt: `Foto de ${entry.name}`,
        whatsapp: entry.whatsapp ?? undefined,
        phone: entry.phone ?? undefined,
      },
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((entry) => entry.advisor);
}