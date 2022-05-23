import * as React from "react"

import "../styles/button.css"

const Button = ({ onClick }) => {
    return (
        <div
            id="our-too-specific-id-to-find"
            className="button"
            onClick={onClick}
        >
            <span
                className="sendTips"
                title="Send tips!"
            >
                Ⓝ
            </span>
        </div>
    )
}

export default Button;
