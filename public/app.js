const buttons = document.querySelectorAll('button[data-endpoint]');
const responseOutput = document.querySelector('#response-output');
const responseStatus = document.querySelector('#response-status');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const endpoint = button.dataset.endpoint;
    const method = button.dataset.method || 'GET';

    buttons.forEach((item) => { item.disabled = true; });
    responseStatus.textContent = `${method} ${endpoint} · Loading...`;
    responseOutput.textContent = 'Waiting for the server response...';

    try {
      const response = await fetch(endpoint, { method });
      const contentType = response.headers.get('content-type') || '';
      const body = contentType.includes('application/json')
        ? JSON.stringify(await response.json(), null, 2)
        : await response.text();

      responseStatus.textContent = `${response.status} ${response.statusText}`;
      responseOutput.textContent = body || '(Empty response body)';
    } catch (error) {
      responseStatus.textContent = 'Request failed';
      responseOutput.textContent = `Could not complete the request. ${error.message}`;
    } finally {
      buttons.forEach((item) => { item.disabled = false; });
    }
  });
});
