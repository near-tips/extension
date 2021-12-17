import * as React from "react"

import "../styles/button.css"

const Button = ({ onClick, isSignedIn }) => {
    return (
        <div
            id="our-too-specific-id-to-find"
            className={isSignedIn ? 'button' : 'signedOutButton'}
            onClick={onClick}
        >
            <img
                width={40}
                height={40}
                className="payTips"
                src={chrome.runtime.getURL('icons/teajs-logo.png')}
                alt="Pay tips!"
                title="Pay tips!"
            />
            <img
                className="nearLogin"
                src={chrome.runtime.getURL('icons/near-logo.svg')}
                alt="Login with Near"
                title="Login with Near wallet"
            />
        </div>
    )
}

export default Button;
