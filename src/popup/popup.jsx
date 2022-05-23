import React from 'react';
import ReactDOM from 'react-dom';

import ErrorBoundary from 'utils/ErrorBoundary';

import PopupContainer from './PopupContainer';

import './popup.css';

const Popup = () => {
    return (
        <div className="popup">
          <ErrorBoundary>
            <PopupContainer />
          </ErrorBoundary>
        </div>
    )
}

// --------------
ReactDOM.render(
    <Popup />,
    document.getElementById('root')
)
