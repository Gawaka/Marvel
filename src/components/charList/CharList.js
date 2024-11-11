import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {                               // // Монтирование компонента, дальше обрабатываем цепучку промисов
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (charList)=> {                 // // в метод записывается charList который получаем в then
        this.setState({                               // // из метода getCharacter возвращается res нужный obj с изм стейтом
            charList, 
            loading: false                            // // как только загрузка закончилась, загрузка становится false
        })
    }

    onError = ()=> {                                  // // метод отвечающий за отоброжение ошибки
        this.setState({
            loading: false,
            error: true
        })
    }

    renderItems(arr) {            // // создаю метод в него помещаю аргументом массив, в будущем в него помещу чарлист
        const items = arr.map((item)=> {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (            // // возвр часть верстки с данными которые получены из массива при помощи мар
                <li 
                    className="char__item char__item_selected"
                    key={item.id}
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (                                // // возвращает обертку персонажа
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error} = this.state;
        const items = this.renderItems(charList);                   // // записываю в переменную массив который перебрал ранее

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

export default CharList;