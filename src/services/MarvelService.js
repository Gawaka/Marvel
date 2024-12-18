

class MarvelService {
    _apiKey = '44ea9d55b5b931eb16b58f5322bd8b9a';
    _apiBase = 'https://gateway.marvel.com:443/v1/public';
    _baseOffset = 310;

    getResource = async (url)=> {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset)=> {
        const res = await this.getResource(`${this._apiBase}/characters?limit=9&offset=${offset}&apikey=${this._apiKey}`)
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id)=> {
        const res = await this.getResource(`${this._apiBase}/characters/${id}?apikey=${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char)=> {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;