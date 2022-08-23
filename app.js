
/* DOM elements selection */

const shortenInput = document.getElementsByClassName("shorten-input")[0];
const copyInput = document.getElementsByClassName("copy-input")[0];
const shortenBtn = document.getElementsByClassName("shorten-btn")[0];
const copyBtn = document.getElementsByClassName("copy-btn")[0];
const formMessage = document.getElementsByClassName("form-message")[0];







/* fetching a shortened url version from the bitly api server */

async function getShortUrl(url) {

    /* Rebrandly API settings */
    const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          apikey: 'fbc6ae27e91644a2961deb231b1e3b3d'
        },
        body: JSON.stringify({destination: url})
      };
    
    /* fetching short url version from the server */
    const result = await fetch('https://api.rebrandly.com/v1/links', options)
    .then(response => response.json())
    .then(response => response["shortUrl"])
    .catch(err => console.error(err));

    return result;

    
}


/* Shorten url from the shorten input */


// regular expression for proper url format 
const urlFormat = /(http(s)?:\/\/(www\.)?)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

shortenBtn.addEventListener("click", function() {
    let longUrl = shortenInput.value;

    if (urlFormat.test(longUrl) === false) {
        
        formMessage.classList.add("error-message");
        formMessage.style.animation = "fade-in 1s";
        formMessage.innerHTML = "wrong url format, please try again!";
        setTimeout(function() { 
            formMessage.innerHTML = "";
            formMessage.style.animation = "";
            formMessage.classList.remove("error-message");
        }, 2000);

        return;
    }
    
    copyInput.style.display = "inline-block";
    copyBtn.style.display = "inline-block";

    /* assining the shor url value to the DOM as soon as it is retrieved from the server */
    (async function () {
        const shortUrl = await getShortUrl(longUrl);
        copyInput.setAttribute("value", shortUrl);
    })();
    
});


/* Copy url to clipboard from the copy input */


// Set copy-to-clipboard functionality to the copyBtn 
var clipboard = new ClipboardJS(".copy-btn");


clipboard.on("success", function(e) {
    let url = `<a href='${e.text}' target='_blank'> ${e.text} </a>`;
    let message = `${url} copied to clipboard!`;
    formMessage.classList.add("success-message");
    formMessage.style.animation = "fade-in 1s";
    formMessage.innerHTML = message; 
    

    setTimeout(function() { 
        copyInput.style.display = "none";
        copyBtn.style.display = "none";
        formMessage.style.animation = "";
        formMessage.innerHTML = "" 
        formMessage.classList.remove("success-message");
    }, 2000); 
    
});

clipboard.on("error", function(e) {
    let message = "Error: copy to clipboard failed!";
    formMessage.classList.add("error-message");
    formMessage.style.animation = "fade-in 1s";
    formMessage.innerHtml = message;
    

    setTimeout(function() { 
        copyInput.style.display = "none";
        copyBtn.style.display = "none";
        formMessage.style.animation = "";
        formMessage.innerHTML = ""
        formMessage.classList.remove("error-message");
    }, 2000);
});


