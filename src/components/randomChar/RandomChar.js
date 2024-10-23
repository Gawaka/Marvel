import { Component } from 'react';
import './randomChar.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MrvelService';
import mjolnir from '../../resources/img/mjolnir.png';


class RandomChar extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService(); // // новый экземпляр класса сервис

    componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    onCharLoaded = (char)=> {
        this.setState({
            char, 
            loading: false
        })
    }

    onError = (char)=> {
        this.setState({
            char,
            loading: false,
            error: true
        })
    }

    onCharLoading = ()=> {
        this.setState({
            loading: true
        })
    }

    updateChar = ()=> {                     // // метод обновляет данные персонажа
        const id = Math.floor(Math.random() * (1011500 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            // .catch(this.onError)
            .catch(this.updateChar)
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null; // // проверка: Если есть ошибка, показываем компонент ошибки и тд...
        const spinner = loading ? <Spinner/> : null;                        // принцип тот же только загрузка 
        const content = !(loading || error) ? <View char={char}/> : null; // // Если нет load и err показываем View


        return (                    // // Если loading == true то показываем спиннер, если не true то компонент View
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick={this.updateChar}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char})=> {                                           // // Компонент рендерящий верстку
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'contain'}
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
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