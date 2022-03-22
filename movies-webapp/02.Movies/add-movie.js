export function addMovie(title, description, img, token){
    //http://localhost:3030/users/movies
    let movie = {
        title,
        description,
        img,
    }
    fetch(`http://localhost:3030/data/movies`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "X-Authorization": token,
        },
        body: JSON.stringify(movie)
    })
    .then(res => res.json())
    .then(data => console.log(data))
}