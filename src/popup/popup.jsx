import React from 'react';
import ReactDOM from 'react-dom';

import PopupContainer from './PopupContainer';

import './popup.css';

const Popup = () => {
    return (
        <div className="popup">
            <PopupContainer />
        </div>
    )
}

// --------------
ReactDOM.render(
    <Popup />,
    document.getElementById('root')
)
