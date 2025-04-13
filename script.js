const button = document.getElementById('get-joke');
const jokeDiv = document.getElementById('joke');

button.addEventListener('click', async () => {
  try {
    const response = await axios.get('https://carambar-6rg0.onrender.com/api/jokes/random');
    const joke = response.data.joke;
    jokeDiv.textContent = joke;
  } catch (error) {
    jokeDiv.textContent = "Oups ! Une erreur est survenue.";
    console.error(error);
  }
});