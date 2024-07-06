//Gestiona la paginación para mostrar diferentes conjuntos de Pokémon. De 10 en 10 y limitar la cantidad `?limit=`
//Permite la búsqueda de Pokémon por nombre. Si no exite deberá aparecer un mensaje de "pokemon no encontrado" 
//Mira como aceder al pokemon por nombre en la documentación.
//Maneja eventos de botones y actualiza dinámicamente la interfaz.


//paso 1 traer nombre imagen de pokemones
//paso 2 mostrar la info en el explorador
//paso 3 capturar botones y demas
//paso 4 que se limite a 10 y manejar lso botones

//AQUI EMPIEZA CODIGO

const app = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');

let currentOffset = 0;
const limit = 10;

const getPokemons = async (offset = 0, limit = 10) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.log("Hay un error: ", err);
        return [];
    }
};

const getPokemonDetails = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("Hay un error: ", err);
        return null;
    }
};

const showPokemons = async (pokemons) => {
    app.innerHTML = '';  // Clear previous pokemons
    for (const pokemon of pokemons) {
        const details = await getPokemonDetails(pokemon.url);
        if (details) {
            const pokemonElement = document.createElement('div');
            pokemonElement.classList.add('pokemon-card');
            pokemonElement.innerHTML = `
                <img src="${details.sprites.front_default}" alt="${details.name}">
                <h3>${details.name}</h3>
            `;
            pokemonElement.addEventListener('click', () => showPokemonDetails(details));
            app.appendChild(pokemonElement);
        }
    }
};

const showPokemonDetails = (pokemon) => {
    const modal = document.createElement('div');
    modal.classList.add('pokemon-modal');
    modal.innerHTML = `
        <div class="pokemon-modal-content">
            <span class="close">&times;</span>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p><strong>Height:</strong> ${pokemon.height}</p>
            <p><strong>Weight:</strong> ${pokemon.weight}</p>
            <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        document.body.removeChild(modal);
    };

    modal.querySelector('.close').addEventListener('click', closeModal);
};

const loadPokemons = async (offset = 0) => {
    const pokemons = await getPokemons(offset, limit);
    showPokemons(pokemons);
};

const searchPokemon = async () => {
    const searchTerm = searchInput.value.toLowerCase();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        if (!response.ok) throw new Error('Pokemon not found');
        const data = await response.json();
        showPokemons([data]);
    } catch (err) {
        app.innerHTML = `<p class="error-message">Pokemon no encontrado</p>`;
    }
};

searchBtn.addEventListener('click', searchPokemon);

prevBtn.addEventListener('click', () => {
    if (currentOffset > 0) {
        currentOffset -= limit;
        loadPokemons(currentOffset);
    }
});

nextBtn.addEventListener('click', () => {
    currentOffset += limit;
    loadPokemons(currentOffset);
});

resetBtn.addEventListener('click', () => {
    currentOffset = 0;
    loadPokemons(currentOffset);
    searchInput.value = '';
});

loadPokemons(currentOffset);


/*const getPokemons = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10") 
      const pokemons = await response.json()
      return pokemons
      //console.log(pokemons);

    } catch (err) {
      console.log("Hay un error: ", err)
    }

    showPokemons(pokemons);
  }

  getPokemons();

  const areaPokedex = document.getElementById('app')


  const showPokemons = (pokemons) => {
        app.innerHTML = '';
      
        pokemons.forEach((pokemon, index) => {
            const template = `
              <div>
                <h2>${pokemons.name}</h2>
              </div>
            `
        areaPokedex.appendChild(template);
}
)};
*/
