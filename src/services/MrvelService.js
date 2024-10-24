class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=44ea9d55b5b931eb16b58f5322bd8b9a';

    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getAllCharacters = async (id)=> {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=310&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id)=> {                                                            // // из этого метода будут возвр.,
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);                                           // // данные которые уже трансформировали
    }

    _transformCharacter = (char)=> {                 // // метод меняющий стейт персонажей
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }
}

export default MarvelService;