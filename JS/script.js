//====== mobile navigation =======
const burger = document.querySelector('.burger')
const nav = document.querySelector('nav')

burger.addEventListener('click',()=>{
    nav.classList.toggle('mobile')
})
// hide the navigation bar when scrolling
window.onscroll = ()=>{
    nav.classList.remove('mobile')
  }


// =============== input ===========
const shortenInput = document.querySelector('.shorten__input')
const form = document.querySelector("form")
form.addEventListener('submit',(e)=>{
    e.preventDefault()
})


// Get/Display Data from Local Storage when loading the page 
if (localStorage.length !==0) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key)
        addShortLink(key,value)
        const copyBtns = document.querySelectorAll(".copy-btn")
        copyBtns.forEach((btn)=>btn.addEventListener("click",(e)=>copyLink(e)))
        
    }
    
}




// ---- Shorten action
const shortenBtn = document.querySelector('#shorten-btn');
shortenBtn.addEventListener('click',()=>{
    const longLink = document.querySelector('#long-link').value
    if (longLink=="") {
        shortenInput.classList.add('active')
    } else {
        shortenInput.classList.remove('active')
        //===== AXIOS =====
        axios.get(`https://api.shrtco.de/v2/shorten?url=${longLink}`)
        .then(function (response) {
            // handle success
            const newLink = response.data.result.short_link2
            addShortLink(longLink,newLink)
            storeData(longLink,newLink)
            document.querySelector('#long-link').value = "";
            
            
        }).then(function () {
            // Copy short link:
            const copyBtns = document.querySelectorAll(".copy-btn")
            copyBtns.forEach((btn)=>btn.addEventListener("click",(e)=>copyLink(e)))  
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
        
    }
})



// ============= FUNCTIONS =============

//====== CopyLink function
function copyLink(e) {
    const linkInput = e.target.parentElement.querySelector(".new-link").innerText
    
    // add new link to the clipboard
    navigator.clipboard.writeText(linkInput);
    // Edit the style of the copyBtn
    e.target.classList.add("clicked")
    e.target.innerHTML="Copied!"
    const shortenLinks = e.target.parentElement.parentElement.parentElement
    // Edit the style of the previous clicked button
    shortenLinks.querySelectorAll('.copy-btn').forEach(btn=>{
        if (btn !== e.target) {
            btn.classList.remove('clicked')
            btn.innerHTML="Copy"
        }
    })
}

//====== Add new short link function
function addShortLink(longLink,shortLink) {
    const shortenLinks = document.querySelector('.shorten__links')
    shortenLinks.innerHTML+=`
    <div class="shorten-link">
        <div class="original-link">
            <span>${longLink}</span>
        </div>
        <div class="shorten-action">
            <span class="new-link">${shortLink}</span>
            <button class="copy-btn">Copy</button>
        </div>
    </div>`
}

// Local Storage :
function localStorageSupported() {
    try {
     return "localStorage" in window && window["localStorage"] !== null;
    } catch (e) {
     return false;
    }
   }

// ====== storeData function : 
function storeData(longLink,newLink) {
    if (localStorageSupported()) {
        let shortLink = document.querySelector(".new-link").innerText;
            localStorage.setItem(longLink,newLink)

    } else {
        console.log("local storage --- NOT --- supported")
    }
}


