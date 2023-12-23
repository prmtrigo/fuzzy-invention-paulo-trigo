document.addEventListener('DOMContentLoaded', function () {
    const pokedexContainer = document.getElementById('pokedexContainer');
    const searchInput = document.getElementById('searchInput');
    const teamContainer = document.getElementById('teamContainer');

    //lista de cores relacionadas aos tipos de pokémon
    const typeColors = {
        normal: '#a8a878',
        fire: '#f08030',
        water: '#6890f0',
        electric: '#f8d030',
        grass: '#78c850',
        ice: '#98d8d8',
        fighting: '#c03028',
        poison: '#a040a0',
        ground: '#e0c068',
        flying: '#a890f0',
        psychic: '#f85888',
        bug: '#a8b820',
        rock: '#b8a038',
        ghost: '#705898',
        dragon: '#7038f8',
        dark: '#705848',
        steel: '#b8b8d0',
        fairy: '#ee99ac'
    };

    const fetchPokemonData = async (start, end) => {
        const promises = [];
        for (let i = start; i <= end; i++) {
            promises.push(fetchPokemon(i));
        }

        try {
            const pokemonDataList = await Promise.all(promises);
            pokemonDataList.forEach(pokemonData => {
                createPokemonCard(pokemonData);
            });
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    };

    const fetchPokemon = (id) => {
        return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json());
    };

    //Criando o card dos Pokémon
    const createPokemonCard = (pokemonData, isTeamCard = false) => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        if (isTeamCard) {
            pokemonCard.classList.add('team-card');
        }

        const spriteUrl = pokemonData.sprites.front_default;
        const typeNames = pokemonData.types.map(type => type.type.name);
        const primaryType = typeNames[0];
        const secondaryType = typeNames[1] || '';

        
        pokemonCard.innerHTML = `
            <img src="${spriteUrl}" alt="${pokemonData.name}" class="sprite">
            <h3>${pokemonData.name}</h3>
            <p>${primaryType}${secondaryType ? ` / ${secondaryType}` : ''}</p>
        `;

        // Define a cor de fundo com base no tipo primário do Pokémon
        const typeColor = typeColors[primaryType];
        pokemonCard.style.backgroundColor = typeColor || '#4b4b4b';

        const addButton = document.createElement('button');
        addButton.innerText = isTeamCard ? '-' : '+';
        addButton.classList.add('team-button');
        addButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (isTeamCard) {
                removeFromTeam(pokemonCard);
            } else {
                addToTeam(pokemonData);
            }
            updateLocalStorage();
        });

        pokemonCard.appendChild(addButton);

        if (isTeamCard) {
            const removeButton = document.createElement('button');
            removeButton.innerText = '-';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                removeFromTeam(pokemonCard);
                updateLocalStorage();
            });
            pokemonCard.appendChild(removeButton);
        }

        // Adiciona o card ao contêiner apropriado no DOM
        if (isTeamCard) {
            teamContainer.appendChild(pokemonCard);
        } else {
            pokedexContainer.appendChild(pokemonCard);
            pokemonCard.addEventListener('click', () => redirectToPokemonPage(pokemonData.id));
        }
    };

    // Adicionar e remover da equipe
    const addToTeam = (pokemonData) => {
        if (teamContainer.childElementCount < 7) {
            createPokemonCard(pokemonData, true);
        } else {
            alert('Your team is already full. Remove a Pokémon before adding more.');
        }
    };

    const removeFromTeam = (pokemonCard) => {
        teamContainer.removeChild(pokemonCard);
    };

    const redirectToPokemonPage = (pokemonId) => {
        window.location.href = `../pokemon_details/pokemon.html?id=${pokemonId}`;
    };


    const searchPokemon = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const pokemonCards = document.querySelectorAll('.pokemon-card');

        pokemonCards.forEach(card => {
            const isTeamCard = card.classList.contains('team-card');
            const pokemonName = card.querySelector('h3').innerText.toLowerCase();

            if (isTeamCard || pokemonName.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('input', searchPokemon);

    fetchPokemonData(1, 151);
    
});


