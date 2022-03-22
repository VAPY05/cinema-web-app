import { showView } from "./router.js";
import { loginHandler } from "./login.js";
import { registerHandler } from "./register.js";
import { hideAll } from "./hide-all-function.js";
import { addMovie } from "./add-movie.js";
import { details } from "./details.js";

window.addEventListener("load", showHomePage);

let homePage = document.getElementById("home-page");
homePage.style.display = "block";

let welcomeContainer = document.querySelector("#welcome a");
let logoutContainer = document.querySelector("#logout a");
let loginContainer = document.querySelector("#login a");
let registerContainer = document.querySelector("#register a");
let buttonAddMovie = document.getElementById("add-movie-button");
let user = localStorage.getItem("token");

if (user) {
  welcomeContainer.textContent = `Welcome, ${localStorage.getItem("email")}`;
  logoutContainer.style.display = "block";
  loginContainer.style.display = "none";
  registerContainer.style.display = "none";
  buttonAddMovie.style.display = "block";
} else {
  welcomeContainer.style.display = "none";
  logoutContainer.style.display = "none";
  loginContainer.style.display = "block";
  registerContainer.style.display = "block";
  buttonAddMovie.style.display = "none";
}

const routes = {
  "/movies": showHomePage,
  "/login": showLoginPage,
  "/register": showRegisterPage,
  "/logout": logOut,
  "/": showHomePage,
};

let navigation = document.querySelector("nav");

navigation.addEventListener("click", (e) => {
  if (e.target.href && e.target.tagName == "A") {
    e.preventDefault();
    let href = new URL(e.target.href).pathname;
    let view = routes[href];
    if (typeof view == "function") {
      view();
    }
  }
});

let homeSection = document.querySelector("#home-page");
let loginSection = document.querySelector("#form-login");
let registerSection = document.querySelector("#form-sign-up");
let movieExample = document.querySelector("#movie-example");
let editMovieSection = document.getElementById("edit-movie");

function showHomePage() {
  hideAll();
  showView(homeSection);
  renderMovies();
}

function showLoginPage() {
  hideAll();
  showView(loginSection);
}

function showRegisterPage() {
  hideAll();
  showView(registerSection);
}

function showExample() {
  hideAll();
  showView(movieExample);
}

function showEditMovie() {
    hideAll();
    showEditMovie(editMovieSection);
}

//login
let loginForm = document.querySelector("#form-login form");
let loginButton = loginForm.querySelector("button");
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  let formDataLogin = new FormData(loginForm);
  let email = formDataLogin.get("email");
  let password = formDataLogin.get("password");
  loginHandler(email, password);
});

//logout
function logOut() {
  localStorage.clear();
  location.reload();
}
//register
let registerForm = registerSection.querySelector("form");
let registerButton = registerSection.querySelector("button");
registerButton.addEventListener("click", (e) => {
  e.preventDefault();
  let registerFormData = new FormData(registerForm);
  let email = registerFormData.get("email");
  let password = registerFormData.get("password");
  let rePassword = registerFormData.get("repeatPassword");
  if (password === rePassword && typeof email !== "undefined") {
    registerHandler(email, password);
  }
});

//add movie button pressed

let addMovieButton = document.querySelector("#add-movie-button a");
addMovieButton.addEventListener("click", (e) => {
  e.preventDefault();
  let addMovieSection = document.getElementById("add-movie");
  hideAll();
  addMovieSection.style.display = "block";
});
//add movie
let addMovieSection = document.getElementById("add-movie");
let addMovieForm = addMovieSection.querySelector("form");
let formDataAddMovie = new FormData(addMovieForm);
let addMovieSubmit = addMovieForm.querySelector("button");
addMovieSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(addMovieForm);
  let movieTitle = document.querySelector("#title").value;
  let movieDescription = document.querySelector("textarea.form-control").value;
  let movieImage = document.querySelector("#imageUrl").value;
  let token = localStorage.getItem("token");
  addMovie(movieTitle, movieDescription, movieImage, token);
  movieTitle = " ";
  movieDescription = " ";
  movieImage = " ";
  hideAll();
  showHomePage();
});

//render movies
function renderMovies() {
  fetch("http://localhost:3030/data/movies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let movies = document.querySelector("#movie div div div");
      movies.innerHTML = " ";
      data.forEach((element) => {
        let movieDiv = document.createElement("div");
        movieDiv.classList = "card mb-4";
        movieDiv.innerHTML = `
              <img class="card-img-top" src="${element.img}" alt="Card image cap" width="400">
              <div class="card-body">
                  <h4 class="card-title">${element.title}</h4>
              </div>
              <div class="card-footer">
                  <a href="#/details/krPgQD6SWf39bM4x00co">
                      <button type="button" class="btn btn-info movieDetails" id="${element._ownerId}">Details</button>
                  </a>
              </div>
          `;
        movies.appendChild(movieDiv);
        console.log(element);
        let details = movieDiv.querySelector("button");
        details.addEventListener("click", (e) => {
          e.preventDefault();
          showExample();
          let movieExample = document.getElementById("movie-example");
          movieExample.innerHTML = `
           
            <div class="row bg-light text-dark">
            <h1>Movie title: ${element.title}</h1>
            <div class="col-md-8">
                <img class="img-thumbnail" src="${element.img}" alt="Movie">
            </div>
            <div class="col-md-4 text-center">
                <h3 class="my-3 ">Movie Description</h3>
                <p>${element.description}</p>
                <a class="btn btn-danger" href="#" id="delete">Delete</a>
                <a class="btn btn-warning" href="#" id="edit">Edit</a>
                <a class="btn btn-primary" href="#" id="like">Like</a>
                <span class="enrolled-span">Liked 1</span>
        </div>
        </div>
        `;
          let deleteButton = document.querySelectorAll("#delete");
          deleteButton = deleteButton[0]
          if(localStorage.getItem("id") && localStorage.getItem("id") == element._ownerId){
            deleteButton.addEventListener("click",(e)=>{
                e.preventDefault();
                fetch(`http://localhost:3030/data/movies/${element._id}`,{
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Authorization": localStorage.getItem("token"),
                    }
                })
                showHomePage();
                showHomePage();
            })
            }else{
                deleteButton.style.display = "none"
            }

            let editButton = document.getElementById("edit");
        if(localStorage.getItem("id") && localStorage.getItem("id") === element._ownerId){
            editButton.addEventListener("click",(e)=>{
                e.preventDefault();
                hideAll();
                editMovieSection.style.display = "block";
               
                

               
                
                let submitButton = document.querySelector("#edit-movie form button"); 
                submitButton.addEventListener("click",(e)=>{
                    e.preventDefault();
                    let movieTitleEdit = document.getElementsByName("title")[1];
                    let movieDescriptionEdit = document.getElementsByName("description")[1];
                    let movieImageEdit = document.getElementsByName("imageUrl")[1];
                    
                    fetch(`http://localhost:3030/data/movies/${element._id}`,{
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Authorization': localStorage.getItem("token")
                        },
                        body: JSON.stringify({title: movieTitleEdit.value, description: movieDescriptionEdit.value, img: movieImageEdit.value}),
                    })
                    hideAll();
                    showHomePage()
                    showHomePage()
                })
        
            })
        }else{
                editButton.style.display = "none";
        }
        });
      });
    });
}

let movieDetails = document.getElementsByClassName("movieDetails");
console.log(movieDetails);
