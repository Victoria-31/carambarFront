const API_BASE_URL = 'https://carambar-6rg0.onrender.com/api';

const jokeButton = document.getElementsByClassName('get-joke')[0];
const jokeContainer = document.getElementsByClassName('joke-random')[0];
const allJokesContainer = document.getElementsByClassName('all-jokes')[0];



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
  try {
    
    const allJokesContainer = document.getElementsByClassName('all-jokes')[0];
    if (!allJokesContainer) {
      console.error('Conteneur de blagues non trouvé');
      return;
    }
    
    allJokesContainer.innerHTML = '<p class="loading">Chargement des blagues...</p>';
    
    const response = await axios.get(`${API_BASE_URL}/jokes`);
    const jokes = response.data;
    console.log('Blagues récupérées:', jokes);
    
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
    
    console.log('Blagues affichées avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération des blagues:', error);
    if (allJokesContainer) {
      allJokesContainer.innerHTML = '<p class="error">Impossible de récupérer les blagues. Veuillez réessayer plus tard.</p>';
    }
  }
}

const reloadButton = document.getElementsByClassName('reload-button')[0];
if (reloadButton) {
  reloadButton.addEventListener('click', loadAllJokes);
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
  const jokeButton = document.getElementsByClassName('get-joke')[0];
  if (jokeButton) {
    jokeButton.addEventListener('click', getRandomJoke);
    
    getRandomJoke();
  }
  
  const jokeForm = document.getElementsByClassName('joke-form')[0];
  if (jokeForm) {
    jokeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const questionInput = document.getElementsByClassName('joke-question')[0];
      const answerInput = document.getElementsByClassName('joke-answer')[0];
      const statusMessage = document.getElementsByClassName('status-message')[0];
      
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
  
  if (document.getElementsByClassName('all-jokes')[0]) {
    loadAllJokes();
  }
});