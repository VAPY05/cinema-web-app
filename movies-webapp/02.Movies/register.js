export function registerHandler(email, password){
    let profile = {
        email,
        password,
    }
    

    fetch("http://localhost:3030/users/register",{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(profile) 
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.code != 409){
        localStorage.setItem("id", data._id);
        localStorage.setItem("email", data.email);
        localStorage.setItem("token", data.accessToken);
    }
    location.reload();
    })

}
