/**
 * Paleta de marca local — única fuente de verdad para los colores de identidad.
 *
 * Inspirada en el sistema visual de Apple: blanco y negro puros, azul eléctrico
 * como acento, sin tonos cálidos, sin dorados, sin mesh decorativos.
 *
 * La API puede enviar un `primaryColor`, pero se IGNORA intencionalmente:
 * la marca es 100% local para que sea consistente, versionable y revisable
 * sin depender del backend.
 *
 * Para ajustar la identidad visual:
 *   1. Modifica los valores de este archivo.
 *   2. Verifica que `src/app/globals.css` tenga los mismos defaults
 *      (así el sitio se ve igual aunque el override inline no se aplique).
 *
 * Estos tokens son CONSTANTES entre el tema claro y el oscuro: la marca debe
 * verse idéntica al togglear el tema. Superficies, textos y fondos sí cambian.
 */
export const storePalette = {
  /** Color principal de marca. Azul tipo "link blue" (#0071e3). */
  primary: "#0071e3",
  /** Hover del primary — un poco más oscuro. */
  primaryHover: "#006edb",
  /** Color de badges y chips destacados. */
  badge: "#0071e3",
} as const;

export type StorePalette = typeof storePalette;
