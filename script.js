const API_BASE_URL = 'https://carambar-6rg0.onrender.com/api';

const jokeButton = document.querySelector('.get-joke');
const jokeContainer = document.querySelector('.joke-random');
const allJokesContainer = document.querySelector('.all-jokes');
const reloadButton = document.querySelector('.reload-button');
const jokeForm = document.querySelector('.joke-form');

function displayJoke(joke) {
  if (!jokeContainer) return;
  jokeContainer.innerHTML = `
    <article class="joke">
      <p class="question">${joke.question}</p>
      <p class="reponse">${joke.answer}</p>
    </article>
  `;
}

async function getRandomJoke() {
  try {
    const response = await axios.get(`${API_BASE_URL}/jokes/random`);
    displayJoke(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération de la blague:', error);
    jokeContainer.innerHTML = '<p class="error">Impossible de récupérer une blague. Veuillez réessayer plus tard.</p>';
  }
}

async function loadAllJokes() {
  if (!allJokesContainer) return;
  allJokesContainer.innerHTML = '<p class="loading">Chargement des blagues...</p>';

  try {
    const response = await axios.get(`${API_BASE_URL}/jokes`);
    const jokes = response.data;

    allJokesContainer.innerHTML = '';

    if (!jokes || jokes.length === 0) {
      allJokesContainer.innerHTML = '<p>Aucune blague disponible pour le moment.</p>';
      return;
    }

    for (const joke of jokes) {
      const jokeElement = document.createElement('article');
      jokeElement.className = 'joke';
      jokeElement.innerHTML = `
        <p class="question">${joke.question || 'Question manquante'}</p>
        <p class="reponse">${joke.answer || 'Réponse manquante'}</p>
      `;
      allJokesContainer.appendChild(jokeElement);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des blagues:', error);
    allJokesContainer.innerHTML = '<p class="error">Impossible de récupérer les blagues. Veuillez réessayer plus tard.</p>';
  }
}

async function addNewJoke(joke) {
  try {
    const response = await axios.post(`${API_BASE_URL}/jokes`, joke);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la blague:', error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (jokeButton) {
    jokeButton.addEventListener('click', getRandomJoke);
    getRandomJoke(); 
  }

  if (jokeForm) {
    jokeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const questionInput = jokeForm.querySelector('.joke-question');
      const answerInput = jokeForm.querySelector('.joke-answer');
      const statusMessage = jokeForm.querySelector('.status-message');

      if (!questionInput.value.trim() || !answerInput.value.trim()) {
        statusMessage.textContent = 'Veuillez remplir tous les champs';
        statusMessage.className = 'status-message error';
        return;
      }

      const newJoke = {
        question: questionInput.value.trim(),
        answer: answerInput.value.trim()
      };

      try {
        await addNewJoke(newJoke);
        jokeForm.reset();
        statusMessage.textContent = 'Blague ajoutée avec succès !';
        statusMessage.className = 'status-message success';
      } catch (error) {
        statusMessage.textContent = 'Erreur lors de l\'ajout de la blague. Veuillez réessayer.';
        statusMessage.className = 'status-message error';
      }
    });
  }

  if (allJokesContainer) {
    loadAllJokes();
  }

  if (reloadButton) {
    reloadButton.addEventListener('click', loadAllJokes);
  }
});
