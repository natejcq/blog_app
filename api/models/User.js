const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new mongoose.Schema({
    username:{type: 'string', required: true, min:2, unique: true},
    password:{type:'string', required: true, min:6},    
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;