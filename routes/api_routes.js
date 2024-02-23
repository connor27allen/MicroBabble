// Create a 'router' using express
const router = require('express').Router();  //router is a CHILD of the server app
// Import the User model
const { User, Mumble } = require('../models');
/*
Create a POST route to register a new user and send the new user object back to the client
  - If mongoose throws an 11000 error(unique/already created), send back a json response with a 'User already exists' message
  - For any other mongoose errors(err.errors), send back a json response with a 'messages' property that is an array of all mongoose errors that were thrown
*/
router.post('/register', async (req, res) => {
  try{
    const user = await User.create(req.body);

    res.json(user);
  } catch (err) {
    console.log(err)

    if (err.code === 11000) {
      return res.json({
        error: 403,
        message: 'a user with that email already exists'
      });
    }

    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'user with that id could not be found'
      });
    }

    if (!err.errors) {
      return res.status(500).json({
        message: 'the server encountered an error'
      });
    }

    let messages = [];

    for (let prop in err.errors) {
      messages.push(err.errors[prop].message)
    }

    res.json({
      error: 403,
      messages
    });
  }
});

//get user by ID
router.get('/user/:id', async (req, res) => {
  const user_id = req.params.id;

  const user = await User.findById(user_id).populate('mumbles', 'text');

  res.json(user);
});

router.post('/mumble', async (req, res) => {
  const { text, user_id } = req.body;

  const mumble = await Mumble.create({
    text: text,
    user: user_id
  })

  const updatedUser = await User.findByIdAndUpdate(user_id, {
    $push: {
      mumbles: mumble._id
    }
  }, { new: true });

  res.json(updatedUser);
});

router.get('/mumbles', async (req, res) => {
  const mumbles = await Mumble.find().populate('user', 'username email');

  res.json(mumbles);
})


// router.get('/users', async (req, res) => {
//   const pageNumber = 1;

//   const users = await User.find().sort({
//     email: 1
//   });

//   res.json(users);
// });

// Export the router object
module.exports = router;