const express = require('express');

const mongoose = require('mongoose');
const morgan = require('morgan');
const uuid = require('uuid');



const multer = require('multer');
const cors = require('./middleware/cors');

const app = express();

app.use('/uploads', express.static('uploads'))
//this configuration is so that the fontend can access the uploads folder

app.use(cors);
app.use(express.static("public"));
app.use(morgan('dev'));

let today = new Date();
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date + ' ' + time;

const storage = multer.diskStorage({
    //stores the file in the project uploads folder
    //remember to add the uploads folder in the gitignore
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, dateTime + " " + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    //this filter limits the type of files the user can upload. 
    // In this case we only want image files so it has been configured to only recieve jpeg and png files
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    //this function limits the size of the files to be uploaded.
    // In this case it has been configured with a 5mb limit
    storage: storage,
    limits: {
        //5mb limit
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const {
    Pictures
} = require('./models/pictures-model');


//get all pictures
app.get('/pictures', (req, res) => {
    console.log("getting all pictures owo")
    Pictures
        .getPictures()
        .then(pictures => {
            return res.status(200).json(pictures);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the pictures";
            return res.status(500).end()
        })
});

//create a new picture
app.post('/createPicture', upload.any(), (req, res) => {
    console.log("adding a new picture B^)");
    //even though the file is sent in form data the server recieves it in the files tag
    let image = req.files[0].path
    //all other stuff sent through the request that is not a file is sent as a body
    let description = req.body.description;

    if (!description || !image) {
        res.statusMessage = "missing param";
        return res.status(406).end(); //not accept status
    }
    let id = uuid.v4();

    let newPicture = {
        id,
        description,
        image
    };

    Pictures
        .createImage(newPicture)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })

});


app.listen(8080, () => {
    console.log("This server is RUNNING ㅇㅅㅇ");

    new Promise((resolve, reject) => {
            const settings = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            };

            mongoose.connect("mongodb://localhost/picturesdb", settings, (err) => {
                if (err) {
                    return reject(err);
                } else {
                    console.log("Database connected successfully :^)")
                    return resolve();
                }
            })
        })
        .catch(err => {
            console.log(err);
        });
});