/**
 * Paleta de marca local — única fuente de verdad para los colores de identidad.
 *
 * Sistema: blanco y negro puros en superficies/texto, naranja industrial cálido
 * como acento. El acento debe verse idéntico al togglear el tema (claro/oscuro).
 *
 * La API puede enviar un `primaryColor`, pero se IGNORA intencionalmente:
 * la marca es 100% local para que sea consistente, versionable y revisable
 * sin depender del backend.
 *
 * Para ajustar la identidad visual:
 *   1. Modifica los valores de este archivo.
 *   2. Verifica que `src/app/globals.css` tenga los mismos defaults
 *      (así el sitio se ve igual aunque el override inline no se aplique).
 */
export const storePalette = {
  /** Color principal de marca. Naranja industrial cálido. */
  primary: "#f56b00",
  /** Hover del primary — un poco más oscuro. */
  primaryHover: "#de5e00",
  /** Color de badges y chips destacados. */
  badge: "#f56b00",
} as const;

export type StorePalette = typeof storePalette;
