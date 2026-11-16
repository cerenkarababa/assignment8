
const buttons = document.querySelectorAll('button[data-endpoint]');
const responseOutput = document.querySelector('#response-output');
const responseStatus = document.querySelector('#response-status');
const emailInput = document.querySelector('#subscribe-email');

const courseSearch = document.querySelector('#course-search');
const courseResults = document.querySelector('#course-results');
const courseSearchMessage = document.querySelector('#course-search-message');

let availableCourses = [];

// Load courses from the server
async function loadCourses() {
  courseSearchMessage.textContent = 'Loading courses...';

  try {
    const response = await fetch('/api/courses');

    if (!response.ok) {
      throw new Error('Could not load courses.');
    }

    availableCourses = await response.json();
    courseSearchMessage.textContent =
      'Start typing to search available courses.';

    // Refresh search after courses are loaded
    searchCourses();

  } catch (error) {
    courseSearchMessage.textContent = error.message;
  }
}

// Search and filter courses
function searchCourses() {
  const searchTerm = courseSearch.value.trim().toLowerCase();

  courseResults.replaceChildren();

  if (!searchTerm) {
    courseSearchMessage.textContent =
      'Start typing to search available courses.';
    return;
  }

  const matchingCourses = availableCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm)
  );

  if (matchingCourses.length === 0) {
    courseSearchMessage.textContent = 'No courses found.';
    return;
  }

  courseSearchMessage.textContent =
    `${matchingCourses.length} course(s) found.`;

  matchingCourses.forEach((course) => {
    const card = document.createElement('article');
    card.className = 'course-card';

    const title = document.createElement('h3');
    title.textContent = course.title;

    const details = document.createElement('p');
    details.textContent =
      `Course ID: ${course.id} · Credits: ${course.credits}`;

    // Create View Details button
    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.textContent = 'View Details';
    detailsButton.addEventListener('click', () => {
      loadCourseDetails(course.id);
    });

    card.append(title, details, detailsButton);
    courseResults.appendChild(card);
  });
}

// Load details of a single course
async function loadCourseDetails(courseId) {
  courseSearchMessage.textContent = 'Loading course details...';

  try {
    const response = await fetch(`/api/courses/${courseId}`);

    if (!response.ok) {
      throw new Error('Could not load course details.');
    }

    const course = await response.json();

    courseSearchMessage.textContent =
      `Course: ${course.title} | ID: ${course.id} | Credits: ${course.credits}`;

  } catch (error) {
    courseSearchMessage.textContent = error.message;
  }
}

// Load courses when the page opens
loadCourses();

// Search whenever the user types
courseSearch.addEventListener('input', searchCourses);

// Existing API request buttons
buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const endpoint = button.dataset.endpoint;
    const method = button.dataset.method || 'GET';

    const requestOptions = { method };

    // Add email data to the subscription request
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
