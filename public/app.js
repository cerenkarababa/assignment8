
const buttons = document.querySelectorAll('button[data-endpoint]');
const responseOutput = document.querySelector('#response-output');
const responseStatus = document.querySelector('#response-status');
const emailInput = document.querySelector('#subscribe-email');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const endpoint = button.dataset.endpoint;
    const method = button.dataset.method || 'GET';

    const requestOptions = {
      method
    };

    // Add the email to the subscription request
    if (endpoint === '/api/subscribe') {
      requestOptions.headers = {
        'Content-Type': 'application/json'
      };

      requestOptions.body = JSON.stringify({
        email: emailInput.value
      });
    }

    buttons.forEach((item) => {
      item.disabled = true;
    });

    responseStatus.textContent = `${method} ${endpoint} · Loading...`;
    responseOutput.textContent = 'Waiting for the server response...';

    const startTime = performance.now();

    try {
      const response = await fetch(endpoint, requestOptions);

      const endTime = performance.now();
      const responseTime = (endTime - startTime).toFixed(2);

      const contentType =
        response.headers.get('content-type') || 'Unknown';

      const body = contentType.includes('application/json')
        ? JSON.stringify(await response.json(), null, 2)
        : await response.text();

      responseStatus.textContent =
        `${method} ${endpoint} | ${response.status} ${response.statusText}`;

      responseOutput.textContent =
        `Response time: ${responseTime} ms\n` +
        `Content-Type: ${contentType}\n\n` +
        `${body || '(Empty response body)'}`;

    } catch (error) {
      responseStatus.textContent = 'Request failed';

      responseOutput.textContent =
        `Could not complete the request.\n${error.message}`;

    } finally {
      buttons.forEach((item) => {
        item.disabled = false;
      });
    }
  });
});
