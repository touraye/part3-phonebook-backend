const mongoose = require( 'mongoose' )

mongoose.set( 'strictQuery', false )

const url = process.env.MongoDB_URI

console.log('Connecting to ', url);

mongoose.connect( url )
    .then( result => {
        console.log('MongoDB connected');
    } )
    .catch( error => console.log( 'Error connecting to MongoDB', error.message ) )
    

const personSchema = mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		require: true,
	},
	number: {
		type: String,
		validate: {
		validator: function (value) {
        // Validate that 'number' consists of two parts separated by a hyphen
        const parts = value.split('-');
        if (parts.length !== 2) {
          return false;
        }

        // Validate the first part has two or three numbers
        const firstPart = parts[0];
        if (!/^\d{2,3}$/.test(firstPart)) {
          return false;
        }

        // Validate the second part consists of numbers
        const secondPart = parts[1];
        return /^\d+$/.test(secondPart);
      },
      message: 'Number must have two or three digits, followed by a hyphen, and then more digits.'
        },        
		required: [true, 'User phone number required'],
	},
})


personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
} )

module.exports = mongoose.model('Person', personSchema)