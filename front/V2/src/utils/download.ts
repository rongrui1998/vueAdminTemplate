import axios from 'axios';

export async function downloadFile(url: string, params?: Record<string, unknown>) {
  const response = await axios.get(url, {
    params,
    responseType: 'blob',
  });

  return response.data;
}
