const mongoose = require( 'mongoose' )

mongoose.set( 'strictQuery', false )

const url = process.env.MongoDB_URI

console.log('Connecting to ', url);

mongoose.connect( url )
    .then( result => {
        console.log('MongoDB connected');
    } )
    .catch( error => console.log( 'Error connecting to MongoDB', error.message ) )
    

const personSchema = mongoose.Schema( {
    name: {
        type: String,
        require: true,
        minLength: 5
    },
    number: {
        type: String,
        require: true
    }
} )


personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
} )

module.exports = mongoose.model('Person', personSchema)