function getPicturesFetch() {
    console.log("get pictures fetch")
    let url = '/pictures';
    let settings = {
        method: 'GET'
    }
    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            for (let i = 0; i < responseJSON.length; i++) {
                results.innerHTML += `
                <div>
                    <div>
                        <img src = "http://localhost:8080/${responseJSON[i].image}" >
                        <h2>${responseJSON[i].description}</h2>
                        <p>${responseJSON[i].id}</p>
                    </div>
                </div>
                `
                //the responseJSON[i].image stores the path to get to the uploads folder
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function addPictureFetch(description, imgFile) {
    console.log("add picture fetch")
    let postUrl = '/createPicture';
    //form data send the image as an object, in the request the file is sent in the files section
    const fd = new FormData();
    fd.append('image', imgFile)
    fd.append('description', description)

    let settings = {
        method: 'POST',
        body: fd
    }

    let results = document.querySelector('.results');
    fetch(postUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = `
            <div>
            <h1>new image added :^)</h1>
            </div>
            `;
            console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function watchAddImageForm() {
    let getPictures = document.getElementById('getAllPictures')

    let form = document.querySelector('.add-image-form');
    let picture = document.getElementById('addImage');
    let description = document.getElementById('pictureDescription');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let imgFile = picture.files[0]
        addPictureFetch(description.value, imgFile);
    });

    getPictures.addEventListener('click', event => {
        getPicturesFetch();
    });
}

function init() {
    watchAddImageForm();
}

init();