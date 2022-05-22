import renderButtons from './renderButtons';
import logger from '../../src/utils/logger';
import 'react-toastify/dist/ReactToastify.css';

const checkReady = setInterval(async () => {
  if (document.readyState === "complete") {
    clearInterval(checkReady)
    logger.log("Near tips are here!")

    renderButtons();
  }
})
