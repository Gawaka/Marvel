import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 310,
        charEnded: false,
        activeCharId: null
    }

    activeChar = React.createRef();

    marvelService = new MarvelService();

    componentDidMount() {                               // // Монтирование компонента, дальше обрабатываем цепучку промисов
        this.onRequest();
    }

    onActiveChar = ()=> {
        if (this.activeChar.current) {
            this.activeChar.current.focus();
        }
    }

    onRequest = (offset)=> {                            // // метод который отправляет запрос
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = ()=> {                        // // переключает состояние в true
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList)=> { // // в метод записывается charList который получаем в then. Метод отв за усп загрузку.
        let ended = false;               // // определяет закончились чары на сервере или нет
        if (newCharList.length < 9) {    // // если осталось меньше 9 чаров, преключаем на true
            ended = true;
        }

        this.setState(({offset, charList})=> ({       // // и разворачиваю его в массив newCharlist при помощи спред
            charList: [...charList, ...newCharList], 
            loading: false,                           // // как только загрузка закончилась, загрузка становится false
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,                         // // помещаю значение переменной в стейт
            activeCharId: newCharList[0].id
        }))
    }

    onError = ()=> {                                  // // метод отвечающий за отоброжение ошибки
        this.setState({
            loading: false,
            error: true
        })
    }

    renderItems(arr) {            // // создаю метод в него помещаю аргументом массив, в будущем в него помещу чарлист
        const items = arr.map((item, i)=> {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (            // // возвр часть верстки с данными которые получены из массива при помощи мар
                <li
                    ref={i === 0 ? this.activeChar : null}
                    className={`char__item ${item.id === this.state.activeCharId ? 'char__item_selected' : null}`}
                    key={item.id}
                    onClick={()=> {
                        this.props.onCharSelected(item.id)
                        this.setState({activeCharId: item.id})
                    }}       /*при клике будет устанавливаться id персонажа*/
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
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);                   // // записываю в переменную массив который перебрал ранее

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button 
                    className="button button__main button__long"
                    style={{'display': charEnded ? 'none' : 'block'}}
                    disabled={newItemLoading}
                    onClick={()=> this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;