// Import 'model' and 'Schema' from mongoose

// Import 'hash' and 'compare' from bcrypt

// Create the userSchema with the following criteria

/**
* Define the username, email and password fields
  - Validation for username
    • required
    • unique
    • minLength of 2
  - Validation for email
    • required
    • unique
    • must be a valid email string
  - Validation for password
    • required
    • minLength of 6

* Use the userSchema.set() method to hash the password on new user creation or on password update

* Use the userSchema.methods property to create a custom instance method called 'validatePass' that takes a form password and compares it to the user's hashed password to return a boolean true if they match

* Create the 'User' model variable using the model function from mongoose

* Export the model
*/

const {model, Schema} = require('mongoose');
const {hash, compare} = require('bcrypt');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "You must enter a username"],
      minlength: [5, "Your username must be at least 5 characters long"]
    },
  
    email: {
      type: String,
      unique: true,
      required: [true, "You must enter a valid email"],
      validate: {
        validator(val) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ig.test(val);
        },
        message: "Your email address is not formatted correctly"
      }
    },

    password: {
      type: String,
      required: [true, 'you must enter a password'],
      minLength: [6, 'your password must be ...']
    }
  },
);

userSchema.pre('save', async function(next) {
  if (!this.isNew || this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }

  //need this so user will be saved to database
  next();
});

userSchema.methods.validatePass = async function(formPassword) {
  const is_valid = await compare(formPassword, this.password);

  return is_valid;
};

userSchema.set('toJSON', {
  transform: (_, user) => {
    delete user.password;
    delete user.__v;
    return user;
  }
});

const User = model('User', userSchema);

module.exports = User;