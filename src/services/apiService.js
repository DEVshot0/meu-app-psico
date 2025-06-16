import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://iscdeploy.pythonanywhere.com/';

async function getCsrfToken() {
  let token = await AsyncStorage.getItem('csrfToken');

  if (!token) {
    const response = await fetch(`${BASE_URL}api/v1/get-csrf-token/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Referer': BASE_URL,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter CSRF token');
    }

    const data = await response.json();
    token = data.csrfToken;
    await AsyncStorage.setItem('csrfToken', token);
  }

  return token;
}

export async function apiService(method, bodyData, endpoint) {
  const csrfToken = await getCsrfToken();

  const headers = {
    'Content-Type': 'application/json',
    'Referer': BASE_URL,
    'X-CSRFToken': csrfToken
  };

  const options = {
    method,
    headers,
  };

  if (method !== 'GET' && method !== 'DELETE' && bodyData) {
    options.body = JSON.stringify(bodyData);
  }

  const response = await fetch(BASE_URL + endpoint, options);

  const contentType = response.headers.get('content-type');
  const responseData = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(responseData?.detail || responseData || 'Erro na requisição');
  }

  return responseData;
}
