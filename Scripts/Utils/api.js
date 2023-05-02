const apiBaseUrl = 'https://localhost:44353/api';

export default function createApi(recurso) {
  const api = {};

  api.get = async (codigo) => {
    if (codigo) {
      const response = await fetch(`${apiBaseUrl}/${recurso}/${codigo}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }

    const response = await fetch(`${apiBaseUrl}/${recurso}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  api.post = async (data) => {
    const response = await fetch(`${apiBaseUrl}/${recurso}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  api.put = async (codigo, data) => {
    const response = await fetch(`${apiBaseUrl}/${recurso}/${codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  api.delete = async (codigo) => {
    const response = await fetch(`${apiBaseUrl}/${recurso}/${codigo}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(
        (await response.json())?.erro ??
          `HTTP error! status: ${response.status}`
      );
    }
  };

  return api;
}
