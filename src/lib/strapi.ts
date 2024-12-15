interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}
/**
 * Obtiene datos de la API de Strapi.
 * @param endpoint - El endpoint para realizar la consulta
 * @param query - Los parámetros de consulta para agregar a la URL
 * @param wrappedByKey - La clave para desempaquetar la respuesta
 * @param wrappedByList - Si la respuesta es una lista, desempaquétala.
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }
  //NO EN DOC
  const strapiUrl: string = import.meta.env
    .PUBLIC_STRAPI_URL;
  const strapiToken: string = import.meta.env
    .PUBLIC_STRAPI_TOKEN;

  //NO EN DOC
  const url = new URL(`${strapiUrl}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const res = await fetch(url.toString(), {
    //ESTA LÍNEA NO ESTÁ EN LA DOC
    headers: {
      Authorization: `Bearer ${strapiToken}`,
    },
  });

  // Manejar errores de la respuesta - NO EN DOC
  if (!res.ok) {
    throw new Error(
      `Error al obtener datos de Strapi: ${res.statusText}`
    );
  }

  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}
