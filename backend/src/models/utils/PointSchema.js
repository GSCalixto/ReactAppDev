const mongoose = require('mongoose');

//Configurações obrigatórias do type do location
const PointSchema = new mongoose.Schema ({
    type: {
        type: String,
        enum: ['Point'],
        required: true, 
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});

module.exports = PointSchema;
