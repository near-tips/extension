
import renderButtons from "./renderButtons";
import 'react-toastify/dist/ReactToastify.css';

const checkReady = setInterval(async () => {
    if (document.readyState === "complete") {
        clearInterval(checkReady)
        console.log("Near tips are here!")

        renderButtons();
    }
})


chrome.runtime.onMessage.addListener((message) => {
    console.log('got back: ', { message })


})
