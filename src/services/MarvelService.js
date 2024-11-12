


class MarvelService {
    _apiKey = '44ea9d55b5b931eb16b58f5322bd8b9a';
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';

    getResource = async (url)=> {               // // ф-ция отправляющая запрос на сервер
        let res = await fetch(url);

        if (!res.ok) {                          // // проверка на ошибку, если есть ошибка при получении, показываем сообщение
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();                // // Если все ок то возвращаем данные в виде json
    }

    getAllCharacters = async ()=> {           // // фция по получению всех персонажей. помещаем в нее getResource а в нее линк на запрос
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=310&apikey=${this._apiKey}`);
        return res.data.results.map(this._transformCharacter); // // мапим массив и возвращаем готовые данные из _transformCharacter
    }

    getCharacter = async (id)=> {             // // фция по получению одного персонажа принцип тот же как и getAllCharacters
        const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char)=> {     // // метод принимает char трансформирует данные стейта персонажей и возвращает готовый obj
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