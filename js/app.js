// DOM elements

const elInput = document.querySelector("#inputName");
const elBtnDarkMode = document.querySelector("#btnDarkMode");
const elBookNumber = document.querySelector("#bookNumber");
const elOrder = document.querySelector("#orderNew");
const elTemplateBooks = document.querySelector("#bookTemplate").content;
const elTemplateBookmarked = document.querySelector("#bookmarkedTemplate").content;
const elBooksList = document.querySelector("#bookList")
const elBody = document.querySelector("#body");
const elDarkMode = document.querySelector("#darkImg")
const elModal = document.querySelector(".modalInfo")
const elBookmarkeds = document.querySelector("#bookmarkeds")

// Local storage

let storage = window.localStorage


// functions

async function fetchBooks(bookname) {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookname}`);
    let data = await response.json()
    let result = data.items
    renderBooks(result , elBooksList)
}

elBooksList.addEventListener("click" , (evt) => {
    let modalBtn = evt.target.dataset.modalId 
    
    if (modalBtn) {
        
        async function fetchBookId(bookId) {
            let response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
            let data = await response.json()
            elModal.querySelector(".modalHeading").textContent = data.volumeInfo.title
            elModal.querySelector(".modalImg").src = data.volumeInfo.imageLinks.smallThumbnail
            elModal.querySelector(".modalText").textContent = data.volumeInfo.description
            elModal.querySelector(".modalAuthors").textContent = data.volumeInfo.authors
            elModal.querySelector(".modalPublished").textContent = data.volumeInfo.publishedDate
            elModal.querySelector(".modalPublishers").textContent = data.volumeInfo.publisher
            elModal.querySelector(".modalCategories").textContent = data.volumeInfo.categories
            elModal.querySelector(".modalPages").textContent = data.volumeInfo.pageCount
            elModal.querySelector("#modalBtn").href = data.volumeInfo.previewLink
        }
        
        fetchBookId(modalBtn)
    }
    
    
})

function renderBooks(array , placeOfArray) {
    placeOfArray.innerHTML = null
    
    elFragment = document.createDocumentFragment()
    
    array.forEach(item => {
        
        let templateWrap = elTemplateBooks.cloneNode(true);
        
        templateWrap.querySelector("#bookName").textContent = item.volumeInfo.title
        templateWrap.querySelector("#bookImg").src = item.volumeInfo.imageLinks.thumbnail
        templateWrap.querySelector("#bookAvtor").textContent = item.volumeInfo.authors
        templateWrap.querySelector("#bookYear").textContent = item.volumeInfo.publishedDate
        templateWrap.querySelector("#readBtn").href = item.volumeInfo.previewLink
        templateWrap.querySelector("#modalBtn").dataset.modalId = item.id
        templateWrap.querySelector("#bookmarkedBtn").dataset.bookmarkedId = item.id
        
        
        elFragment.appendChild(templateWrap)
        
    });
    
    bookNum = array.length
    
    if (!bookNum == 0 ) {
        elBookNumber.textContent = array.length
    }
    
    if (bookNum = 0) {
        elBookNumber.textContent = "not found"
    }
    
    placeOfArray.appendChild(elFragment)
    
}

let bookmarkedBooks = JSON.parse(storage.getItem("books")) || []

function renderBookmarkedBooks(array , placeOfArray) {
    placeOfArray.innerHTML = null
    
    let elFragment = document.createDocumentFragment()
    
    array.forEach(item => {
        let template = elTemplateBookmarked.cloneNode(true)
        template.querySelector("#bookmarkedName").textContent = item.volumeInfo.title
        template.querySelector("#bookmarkedText").textContent = item.volumeInfo.authors
        template.querySelector("#readBookmarked").href = item.volumeInfo.previewLink
        template.querySelector("#deleteBookmarked").dataset.deleteId = item.id
        elFragment.appendChild(template)
    });
    placeOfArray.appendChild(elFragment)
}

renderBookmarkedBooks(bookmarkedBooks , elBookmarkeds)

elInput.addEventListener("input" , function () {
    
    let bookname = elInput.value.trim().toString()
    
    if (bookname) {
        fetchBooks(bookname)
    }
})

elBtnDarkMode.addEventListener("click" , () => {
    let bodyControl = elBody.classList.toggle("black")
    elBooksList.classList.toggle("bgc")
    
    if (bodyControl) {
        elDarkMode.src = "./components/moon.png"
    }else{
        elDarkMode.src = "./components/sun.svg"
    }
    
})

elBooksList.addEventListener("click" , (evt) => {
    let bookmarkedBtn = evt.target.dataset.bookmarkedId
    
    if (bookmarkedBtn) {
        async function fetchBookmark(bookmarkedBtn) {
            let response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkedBtn}`)
            let data = await response.json()
            
            bookmarkedBooks.push(data)
            storage.setItem("books" , JSON.stringify(bookmarkedBooks))
            renderBookmarkedBooks(bookmarkedBooks , elBookmarkeds)
        }
        
        fetchBookmark(bookmarkedBtn)
    }
})

elBookmarkeds.addEventListener("click" , (evt) => {
    let deleteBtn = evt.target.dataset.deleteId
    
    if (deleteBtn) {
        let controlIndex = bookmarkedBooks.findIndex(item => item.id == deleteBtn)
        
        bookmarkedBooks.splice(controlIndex , 1)
        storage.setItem("books" , JSON.stringify(bookmarkedBooks))
        storage.clear()
        renderBookmarkedBooks(bookmarkedBooks , elBookmarkeds)

    }
})

elOrder.addEventListener("click" , (evt) => {

    let booknewname = elInput.value.trim().toString()

    async function fetchBooksnews(booknewname) {
        let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${booknewname}&orderBy=newest`);
        let data = await response.json()
        let result = data.items
        renderBooks(result , elBooksList)
    }

    fetchBooksnews(booknewname)
})
