import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ToastContainer } from 'react-toastify';

import ButtonContainer from './ButtonContainer';

const getAnswerId = (answer) => {
    let node = answer.parentElement
    let answerId = null

    while (!answerId && node) {
        const id = node.getAttribute('data-answerid')

        if (id) {
            answerId = id;
        }

        node = node.parentElement
    }

    return answerId
}

const renderButtons = () => {
    const root = document.createElement('div');
    root.id = 'near-tips-root';
    document.body.appendChild(root);

    const answers = document.querySelectorAll('.answer .js-voting-container');

    const mappedAnswers = Array.from(answers).map((answer, index) => {
        const buttonContainer = document.createElement('div')
        buttonContainer.id = `near-tips-button-${index}`

        answer.insertBefore(buttonContainer, answer.firstChild);

        const authorsLinks = answer.parentElement.nextElementSibling.querySelectorAll('.user-info .user-details a')

        const { authorIds, authorNicknames } = Array.from(authorsLinks).reduce((acc, authorLink) => {
            const splittedLink = authorLink.href.split('/')

            acc.authorIds.push(splittedLink[splittedLink.length - 2])
            acc.authorNicknames.push(splittedLink[splittedLink.length - 1])

            return acc;
        }, {
            authorIds: [],
            authorNicknames: [],
        })

        const answerId = getAnswerId(answer);

        return {
            container: buttonContainer,
            authorIds,
            authorNicknames,
            answerId,
        }
    })

    // console.log({answers, mappedAnswers});

    ReactDOM.render(
        <>
            <ButtonContainer answers={mappedAnswers} />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>,
        root
    );
}

export default renderButtons;
