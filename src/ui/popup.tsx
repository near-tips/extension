import * as React from 'react'
import * as ReactDOM from 'react-dom'

import PopupContainer from './PopupContainer';

import '../styles/popup.css'

const Popup = () => {
    return (
        <PopupContainer />
    )
}

// --------------

ReactDOM.render(
    <Popup />,
    document.getElementById('root')
)
