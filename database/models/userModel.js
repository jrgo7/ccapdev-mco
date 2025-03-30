const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true
    },    
    // TODO - Password is still in plain text, better stored hashed
    password: {
        type: String, 
        required: true
        //min
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // if password is changed, no need to hash.
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
    next();
});

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Users', userSchema);