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


// async functions

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
        templateWrap.querySelector("#bookImg").src = item.volumeInfo.imageLinks.smallThumbnail
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

