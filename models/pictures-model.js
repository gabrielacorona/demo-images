const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    //the image is stored as the path to the uploads folder, not as an object
    image: {
        type: String,
        required: true
    }

});

const pictureCollection = mongoose.model('pictures', pictureSchema);

const Pictures = {
    createImage: function (newPicture) {
        return pictureCollection
            .create(newPicture)
            .then(createdImage => {
                return createdImage;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    //get all pictures
    getPictures: function () {
        return pictureCollection
            .find()
            .then(pictures => {
                return pictures;
            })
            .catch(err => {
                throw new Error(err);
            })
    }
}

module.exports = {
    Pictures
}