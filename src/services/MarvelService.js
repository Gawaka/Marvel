import { useHttp } from "../hooks/http.hook";

const useMarvelService = ()=> {
    const {loading, request, error, clearError} = useHttp();

    const _apiKey = '44ea9d55b5b931eb16b58f5322bd8b9a';
    const _apiBase = 'https://gateway.marvel.com:443/v1/public';
    const _baseOffset = 310;

    const getAllCharacters = async (offset = _baseOffset)=> {
        const res = await request(`${_apiBase}/characters?limit=9&offset=${offset}&apikey=${_apiKey}`)
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id)=> {
        const res = await request(`${_apiBase}/characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const _transformCharacter = (char)=> {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    };

    return {loading, error, getAllCharacters, getCharacter, clearError}
};

export default useMarvelService;