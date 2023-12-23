document.addEventListener('DOMContentLoaded', function () {
    const pokemonDetailsContainer = document.getElementById('pokemonDetailsContainer');

    const queryParams = new URLSearchParams(window.location.search);
    const pokemonId = queryParams.get('id');

    // Verifica se o ID do Pokémon está presente na URL
    if (pokemonId) {
        fetchPokemonData(pokemonId);
    } else {
        console.error('No Pokemon ID found in the URL');
    }

    function fetchPokemonData(id) {
        document.body.classList.add('loading-overlay');

        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(pokemonData => {
                createPokemonDetails(pokemonData);
            })
            .catch(error => console.error('Error fetching Pokémon details:', error))
            .finally(() => {
                document.body.classList.remove('loading-overlay');
            });
    }

    // Função para criar os detalhes do Pokémon na página
    function createPokemonDetails(pokemonData) {
        const pokemonDetails = document.createElement('div');
        pokemonDetails.classList.add('pokemon-details');

        const officialArtwork = document.createElement('img');
        officialArtwork.src = getOfficialArtwork(pokemonData.id);
        officialArtwork.alt = pokemonData.name;
        officialArtwork.classList.add('official-artwork');
        pokemonDetails.appendChild(officialArtwork);

        const statsContainer = document.createElement('div');
        statsContainer.classList.add('stats-container');

        const name = document.createElement('h2');
        name.textContent = pokemonData.name;

        const types = document.createElement('p');
        types.textContent = `Type: ${pokemonData.types.map(type => type.type.name).join(', ')}`;

        const ability = document.createElement('p');
        ability.textContent = `Ability: ${pokemonData.abilities[0].ability.name}`;

        const weight = document.createElement('p');
        weight.textContent = `Weight: ${pokemonData.weight / 10} kg`;

        const height = document.createElement('p');
        height.textContent = `Height: ${pokemonData.height / 10} m`;

        statsContainer.appendChild(name);
        statsContainer.appendChild(types);
        statsContainer.appendChild(ability);
        statsContainer.appendChild(weight);
        statsContainer.appendChild(height);

        const baseStats = document.createElement('div');
        baseStats.classList.add('base-stats');

        pokemonData.stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.classList.add('stat');

            const statName = document.createElement('p');
            statName.textContent = stat.stat.name;

            const statValue = document.createElement('p');
            statValue.textContent = stat.base_stat;

            const statBarContainer = document.createElement('div');
            statBarContainer.classList.add('stat-bar');

            const statBar = document.createElement('span');
            statBar.style.width = `${(stat.base_stat / 255) * 150}%`;

            statBarContainer.appendChild(statBar);

            statElement.appendChild(statName);
            statElement.appendChild(statValue);
            statElement.appendChild(statBarContainer);

            baseStats.appendChild(statElement);
        });

        statsContainer.appendChild(baseStats);

        pokemonDetails.appendChild(statsContainer);

        const spritesContainer = document.createElement('div');
        spritesContainer.classList.add('sprites-container');

        const shinySprite = createSprite(pokemonData.sprites.front_shiny, 'Shiny');
        spritesContainer.appendChild(shinySprite);

        const normalSprite = createSprite(pokemonData.sprites.front_default, 'Normal');
        spritesContainer.appendChild(normalSprite);

        pokemonDetails.appendChild(spritesContainer);

        pokemonDetailsContainer.appendChild(pokemonDetails);
    }

    function createSprite(src, title) {
        const sprite = document.createElement('img');
        sprite.src = src;
        sprite.alt = title;
        sprite.title = title;
        sprite.classList.add('sprite');
        return sprite;
    }

    function getOfficialArtwork(id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    }
});
