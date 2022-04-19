
import renderButtons from "./renderButtons";
import {WORKER_METHODS} from "../constants";

const checkReady = setInterval(async () => {
    if (document.readyState === "complete") {
        clearInterval(checkReady)
        console.log("Near tips are here!")

        renderButtons();

        // chrome.runtime.sendMessage({
        //     message: 'privet from content'
        // })
    }
})


chrome.runtime.onMessage.addListener((message) => {
    console.log('got back: ', { message })


})
