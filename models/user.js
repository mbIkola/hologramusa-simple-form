const mongoose = require('mongoose');
const crypto   = require('crypto');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, required: true, index: true, unique: true , set: (s) => s.toLowerCase()  },
    password_hash:  {type: String, required: true},
    firstname: String,
    lastname: String,
    role: { type : String },
    salt : { type : String }
});
userSchema.virtual('password')
    .get(function() {
        return this._password;
    })
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.password_hash = this.encryptPassword(password);
    });

userSchema.methods = {
        authenticate: function(plainTextPass) {
            return this.encryptPassword(plainTextPass) === this.password_hash;
        },

        makeSalt: function() {
            return (Math.random() * ( + new Date())).toString(16);
        },
        encryptPassword: function(plaintextPass) {
            return crypto.createHmac('sha1', this.salt).update(plaintextPass).digest('hex');
        },
        getPublicProjection: function() {
            return {
                id: this._id,
                email: this.email,
                firstname: this.firstname || "",
                lastname: this.lastname || "",
                role: this.role || "someone"
            };
        }

};

//var User = mongoose.model('User', userSchema);



module.exports = function(db) {
    return db.model('User', userSchema);
};
