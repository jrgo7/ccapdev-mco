const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true
    },    
    // TODO - Password is still in plain text, better stored hashed
    password: {
        type: String, 
        required: true
    },
    username: {
        type: String, 
        required: true
    },
    subtitle: {
        type: String, 
        required: false
    },
    avatar: {
        type: String, 
        required: false
    },
    description: {
        type: String, 
        required: false
    },
    lastSeen: {
        type: Date, 
        required: true,
        default: Date.now
    },
    accountCreateDate: {
        type: Date, 
        required: true,
        default: Date.now
    },
    favoriteGame: {
        type: String, 
        required: false
    }
})

module.exports = mongoose.model('Users', userSchema);