// Select elements from DOM 
let elWrapper = document.querySelector("#wrapper")
let elForm = document.querySelector("#form")
var elSearchInput = document.querySelector("#search_input")
let elCategorySelect = document.querySelector("#category-select")
let elRating = document.querySelector("#rating")
let elSort = document.querySelector("#rating_sort")
let elBtn = document.querySelector("#btn")
let elTitle = document.querySelector("#search-result")
let elBookmarkedList = document.querySelector(".bookmarked-list")
let elTemplate = document.querySelector("#movie_card").content
let elBookmarkTemplate = document.querySelector("#bookmarked").content;



// Get movies list 
let slicedMovies = movies.slice(0, 5);

var normolizedMovieList = slicedMovies.map((movieItem, index) => {
    return {
        id: index + 1,
        title: movieItem.Title.toString(),
        categories: movieItem.Categories,
        rating: movieItem.imdb_rating,
        year: movieItem.movie_year,
        imageLink: `https://i.ytimg.com/vi/${movieItem.ytid}/mqdefault.jpg`,
        youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`  
    }
})


// Create categories
function generateCategories(movieArray) {
    let categoryList = [];
    
    movieArray.forEach(function(item) {
        let splittedCategories = item.categories.split("|");
        
        splittedCategories.forEach(function (item) {
            if (!categoryList.includes(item)) {
                categoryList.push(item)
            }
        })
    })
    
    categoryList.sort()
    
    let categoryFragment = document.createDocumentFragment()
    
    categoryList.forEach(function (item) {
        let categoryOption = document.createElement("option")
        
        categoryOption.value = item
        categoryOption.textContent = item
        categoryFragment.appendChild(categoryOption)
    })
    
    elCategorySelect.appendChild(categoryFragment)
}

generateCategories(normolizedMovieList);


// Create render function of movies card
function renderMovies(movieArray, wrapper){
    wrapper.innerHTML = null;
    let elFragment = document.createDocumentFragment()
    
    movieArray.forEach(movie => {
        let templateDiv = elTemplate.cloneNode(true)
        
        templateDiv.querySelector(".card-img-top").src = movie.imageLink
        templateDiv.querySelector(".card-title").textContent = movie.title
        templateDiv.querySelector(".card-categories").textContent = movie.categories.split("|").join(", ")
        templateDiv.querySelector(".card-year").textContent = movie.year
        templateDiv.querySelector(".card-rate").textContent = movie.rating
        templateDiv.querySelector(".card-link").href = movie.youtubeLink
        templateDiv.querySelector(".bookmark-btn").dataset.movieItemId = movie.id
        
        elFragment.appendChild(templateDiv);
    });
    wrapper.appendChild(elFragment);
    
    elTitle.textContent = movieArray.length;
}
renderMovies(normolizedMovieList, elWrapper);


// Create filter function
var findMovies = function (movie_title, minRating, genre) {
    
    return normolizedMovieList.filter(function (movie) {
        var doesMatchCategory = genre === 'All' || movie.categories.split("|").includes(genre);
        
        return movie.title.match(movie_title) && movie.rating >= minRating && doesMatchCategory;
    });
};


// Create submit and search high,low function
elForm.addEventListener("submit", function(evt) {
    evt.preventDefault()
    
    let searchInput = elSearchInput.value.trim()
    let ratingInput = elRating.value.trim()
    let selectOption = elCategorySelect.value
    let sortingType = elSort.value
    
    let pattern = new RegExp(searchInput, "gi")
    let resultArray = findMovies(pattern, ratingInput, selectOption)
    
    if (sortingType === "high") {
        resultArray.sort((b, a) => a.rating - b.rating)
    }
    
    if (sortingType === "low") {
        resultArray.sort((a, b) => a.rating - b.rating)
    }
    
    renderMovies(resultArray , elWrapper);
})

/*------------------------------------------------------------------------*/

let storage = window.localStorage;

let bookmarkedMovies = JSON.parse(storage.getItem("movieArray")) || [];


elWrapper.addEventListener("click", function(evt) {
    let movieID = evt.target.dataset.movieItemId;

    if (movieID) {
        let foundMovie = normolizedMovieList.find( item => item.id == movieID )

        let doesInclude = bookmarkedMovies.findIndex(item => item.id === foundMovie.id)

        if (doesInclude === -1) {
            bookmarkedMovies.push(foundMovie)
            storage.setItem("movieArray", JSON.stringify(bookmarkedMovies))

            renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)
        }
    }
})


// Render bookmarked movies...
function renderBookmarkedMovies(array, wrapper) {
    wrapper.innerHTML = null

    let elFragment = document.createDocumentFragment()
    array.forEach(function(item) {
        let templateBookmark = elBookmarkTemplate.cloneNode(true)

        templateBookmark.querySelector(".movie-title").textContent = item.title
        templateBookmark.querySelector(".btn-remove").dataset.markedId = item.id

        elFragment.appendChild(templateBookmark)
        console.log(elFragment);
    })

    wrapper.appendChild(elFragment)
}

renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList);


// Clear remove Array
elBookmarkedList.addEventListener("click", function(evt) {
    let removeMovieId = evt.target.dataset.markedId;

    if (removeMovieId) {
        let indexOfMovie = bookmarkedMovies.findIndex(function (item) {
            return item.id == removeMovieId
        })

        bookmarkedMovies.splice(indexOfMovie, 1)
        storage.setItem("movieArray", JSON.stringify(bookmarkedMovies))
        storage.clear()

        renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)
    }
})




