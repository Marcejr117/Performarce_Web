// Datos del negocio: única fuente para toda la web (cabecera, pie, contacto, mapa y JSON-LD).
export const BUSINESS = 'Talleres Marcelino';
export const SITE = 'https://www.performarce.com';
export const PHONE = '+34967226001';
export const PHONE_LABEL = '967 226 001';
export const WHATSAPP_NUMBER = '34608353343';
export const WHATSAPP_LABEL = '608 353 343';
export const WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}`;
/** WhatsApp con el mensaje ya escrito. */
export const waLink = (text = 'Hola, os escribo desde la web de Talleres Marcelino.') =>
  `${WHATSAPP}?text=${encodeURIComponent(text)}`;
export const EMAIL = 'oficina@performarce.com';
export const STREET = 'Av. los Toreros, 22';
export const POSTAL_CODE = '02005';
export const CITY = 'Albacete';
export const ADDRESS = `${STREET}, ${POSTAL_CODE} ${CITY}`;
export const GEO = { lat: 38.9982411, lng: -1.8684794 } as const;
/** Ficha de Google Maps (reseñas y fotos). La URL actual, sin «?entry=ttu». */
export const MAPS =
  'https://www.google.es/maps/place/Talleres+Marcelino/@38.998388,-1.8699614,17.5z/data=!4m6!3m5!1s0xd665fb487f1ea51:0x578c1f902ab4afec!8m2!3d38.9982411!4d-1.8684794!16s%2Fg%2F11cnsm_v5w';
/** «Cómo llegar»: se abren solo al pulsar; la web no carga nada de estos servicios. */
export const DIRECTIONS = {
  google: `https://www.google.com/maps/dir/?api=1&destination=${GEO.lat},${GEO.lng}`,
  apple: `https://maps.apple.com/?daddr=${GEO.lat},${GEO.lng}`,
  waze: `https://waze.com/ul?ll=${GEO.lat},${GEO.lng}&navigate=yes`,
} as const;
export const SOCIAL = {
  facebook: 'https://www.facebook.com/profile.php?id=100063714483433',
  youtube: 'https://www.youtube.com/@motosmarcelinomotosmarceli8261',
} as const;
/**
 * Horario semanal. Días ISO (1 = lunes … 7 = domingo); horas 'HH:MM'; un objeto por tramo.
 * null = SIN CONFIRMAR: no aparece en la web (pie, contacto, ubicación) ni en los datos para Google.
 * Al rellenarlo, aparece solo en todos esos sitios. Ejemplo (lo que muestra Google, NO confirmado):
 *   [{ days: [1, 2, 3, 4, 5], opens: '09:00', closes: '14:00' },
 *    { days: [1, 2, 3, 4, 5], opens: '16:00', closes: '20:30' }]
 */
export const HOURS: { days: number[]; opens: string; closes: string }[] | null = null;
