export function loginHandler(email, password){
    let profile = {
        email,
        password
    }
    fetch("http://localhost:3030/users/login",{
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(profile)
    })
    .then(res => res.json())
    .catch(data => alert("Error404"))
    .then(data => {
        if(data.code == "403"){
        alert("error403")    
        }else{  
        localStorage.setItem("id", data._id);
        localStorage.setItem("email", data.email);
        localStorage.setItem("token", data.accessToken);
        location.reload();
        }
    });
}