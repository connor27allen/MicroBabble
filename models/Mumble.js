const {model, Schema} = require('mongoose');

const mumbleSchema = new Schema({
    text: {
        type: String,
        required: [true, 'You must type a text value for your mumble'],
        minLength: [3, 'Your mumble must be at least 3 characters in length']
      },

      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
});

mumbleSchema.set('toJSON', {
    transform: (_, mumble) => {
      delete mumble.__v;
      return mumble;
    }
  });

const Mumble = model('Mumble', mumbleSchema);

module.exports = Mumble;