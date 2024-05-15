class User {
    constructor(name, surname, email) {
        this.name = name
        this.surname = surname
        this.email = email
    }
}

async function addUser(event) {
    event.preventDefault()
    const name = document.getElementById("name").value
    const surname = document.getElementById("surname").value
    const email = document.getElementById("email").value


    const newUser = new User(name, surname, email)

    document.getElementById("userForm").reset()
    
    try {
        const response = await fetch('http://localhost:3000/users/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
            
        })

        const result = await response.json()
        console.log(result)

    } catch (error) {
        console.error('Error adding user:', error.message)
    }
}

async function searchUserByEmail(event) {
    event.preventDefault();
    const userEmail = document.getElementById('userEmail').value;
    
    try {
        const userInfo = await fetch(`http://localhost:3000/users/searchUserByEmail?userEmail=${userEmail}`);
        
        if (userInfo.ok) {
            const userData = await userInfo.json();
            const infoElement = document.getElementById("formattedInfo");

            // Suponiendo que studentData es un objeto con las etiquetas y valores de información del estudiante
            const formattedInfo = Object.entries(userData).map(([label, value]) => `${label}: ${value}`).join('<br>');
            infoElement.innerHTML = formattedInfo; // Muestra la información del estudiante en el elemento HTML
        } else {
            console.error('Error retrieving user information:', userInfo.status);
        }
    } catch (err) {
        console.error('Error retrieving user information:', err);
    }
}