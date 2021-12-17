
import renderButtons from "./renderButtons";

chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(async () => {
        if (document.readyState === "complete") {
            clearInterval(checkReady)
            console.log("Near tips are here!")

            renderButtons();
        }
    })
})
