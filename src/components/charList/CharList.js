import React, { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';
import PropTypes from 'prop-types';

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

    marvelService = new MarvelService();

    activeCharRef = React.createRef();

    componentDidMount() {
        this.onRequest();
        }

        onRequest = (offset)=> {
            this.onCharListLoading();
            this.marvelService
                .getAllCharacters(offset)
                .then(this.onCharListLoaded)
                .catch(this.onError)
        }

        onCharListLoading = ()=> {
            this.setState({
                newItemLoading: true
            })
        }

    onCharListLoaded = (newCharList)=> {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList})=> ({
            charList: [...charList, ...newCharList], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
            activeCharId: newCharList[0]?.id
        }))
    }

    onError = ()=> {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderItems(arr) {
        const items = arr.map((item) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'}
            }

            return (
                <li className={`char__item ${item.id === this.state.activeCharId ? 'char__item_selected' : ''}`}
                    key={item.id}
                    onClick={()=> {
                        this.props.onCharSelected(item.id)
                        this.setState({activeCharId: item.id})
                    }}
                    
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                <div className="char__name">{item.name}</div>
            </li>
            )
        })

        return(
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !error ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                    onClick={()=> this.onRequest(offset)}
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
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