import React, { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

const CharList = (props)=> {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(310);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, clearError, getAllCharacters} = useMarvelService();

    useEffect(()=> {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial)=> {
        clearError();
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList)=> {

        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charlist => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id)=> {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { objectFit: 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { objectFit: 'unset' };
            }
    
            return (
                <CSSTransition 
                    key={item.id} 
                    timeout={300} 
                    classNames="char__item"
                >
                    <li className="char__item"
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                    >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
    
        return (
            <TransitionGroup component="ul" className="char__grid">
                {items}
            </TransitionGroup>
        );
    }
    

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                onClick={()=> onRequest(offset)}
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;