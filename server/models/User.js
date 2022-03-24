const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // The match option is a type of validation that allows us to use 
      // regex to test the input value. In our case, we are using a regex pattern 
      // to test if the data being entered to the email field is in fact a valid email 
      // address that follows the pattern <string>@<string>.<string>. If it doesn't, 
      // we send back a custom error message stating that there must be a valid email address.
      match: [/.+@.+\..+/, 'Must match an email address!']
    },
    password: {
      type: String,
      required: true,
      minlength: 5
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

// set up pre-save middleware to hash and create password
// Just like Express.js, Mongoose implements something called middleware to 
// capture our data before getting to or coming from the database and manipulating 
// it. In our case, we check to see if the data is new or if the password has been 
// modified. This way we can use this same middleware for both new users and users 
// who are updating their information but don't want to update their password values.
userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
