import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();                        // // новый экземпляр сервисного класса

    componentDidMount() {
        this.updateChar();
        
        // this.timerId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }


    updateChar = ()=> {                               // // метод по обновлению данных(получение персонажа и изменение стейта)
        const id = Math.floor(Math.random() * (1011500 - 1011000) + 1011000);
        this.onCharLoading()
        this.marvelService                            // // обращаемся к сервису=> к его методу getCharacter и обробатываем промисы
            .getCharacter(id)
            .then(this.onCharLoaded)                  // // помещаем метод о загрузке персонажа в него записывается char
            .catch(this.updateChar)                      // // обработка ошибки
    }

    onCharLoaded = (char)=> {                         // // в метод записывается char который получаем в then
        this.setState({                               // // из метода getCharacter возвращается res нужный obj с изм стейтом
            char, 
            loading: false                            // // как только загрузка закончилась, загрузка становится false
        })
        // console.log(char);
    }

    onCharLoading = ()=> {
        this.setState({
            loading: true
        })
    }

    onError = ()=> {                                  // // метод отвечающий за отоброжение ошибки
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;    // // если ошибка, показываем компонент с ошибкой
        const spiner = loading ? <Spinner/> : null;             // // если загрузка, показываем спинер
        const content = !(error || loading) ? <View char={char}/> : null;  // // если нет ни того ни другого то показываем View


        return (
            <div className="randomchar">
                {errorMessage}
                {spiner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char})=> {            // // компонент принимает в себя obj char и возвращает кусочек верстки в виде персонажа
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {'objectFit': 'contain'}
    }

    return (
    <div className="randomchar__block">
        <img src={thumbnail} alt={name} className="randomchar__img" style={imgStyle}/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
    )
}

export default RandomChar;