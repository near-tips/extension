import * as ReactDOM from "react-dom";
import * as React from "react";

import ButtonContainer from "./ButtonContainer";

const renderButtons = () => {
    const root = document.createElement('div');
    root.id = 'near-tips-root';
    document.body.appendChild(root);

    const answers = document.querySelectorAll('.answer .js-voting-container');

    const mappedAnswers = Array.from(answers).map((answer, index) => {
        const buttonContainer = document.createElement('div')
        buttonContainer.id = `near-tips-button-${index}`
        answer.appendChild(buttonContainer);

        const authorsLinks = answer.parentElement.nextElementSibling.querySelectorAll('.user-info .user-details a')

        const authorIds = Array.from(authorsLinks).map(authorLink => {
            const splittedLink = authorLink.href.split('/');

            return splittedLink[splittedLink.length - 2];
        })

        return {
            container: buttonContainer,
            authorIds,
        }
    })

    console.log({answers, mappedAnswers});

    ReactDOM.render(
        <ButtonContainer answers={mappedAnswers} />,
        root
    );
}

export default renderButtons;
