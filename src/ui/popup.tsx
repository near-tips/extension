import * as React from 'react'
import * as ReactDOM from 'react-dom'

import PopupContainer from './PopupContainer';

import '../styles/popup.css'

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
