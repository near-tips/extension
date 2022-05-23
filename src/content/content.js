
import renderButtons from './renderButtons';
import logger from 'utils/logger';
import 'react-toastify/dist/ReactToastify.css';
import './content.css';

const checkReady = setInterval(async () => {
    if (document.readyState === "complete") {
        clearInterval(checkReady)
        logger.log("Near tips are here!")

        renderButtons();
    }
})
