/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require( 'mongoose' )

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[ 2 ]
const name = process.argv[ 3 ]
const number = process.argv[ 4 ]

const url = `mongodb+srv://ebrima:${password}@sandbox.ooueg.mongodb.net/phonebook?retryWrites=true&w=majority`
const URL = 'mongodb://localhost:27017//phonebook'

mongoose.set('strictQuery', false)
mongoose.connect( url )

const personSchema = new mongoose.Schema( {
  name: String,
  number: String
} )

const Person = mongoose.model( 'Person', personSchema )

const person = new Person( {
  name,
  number
})


person.save().then( result => {
  console.log(`Added ${name} ${number} to phonebook`)

  mongoose.connection.close()
} )


Person.find( {} ).then( res => {
  console.log('Phonebook:')
  res.forEach( person => console.log( person.name, ' ', person.number ) )

  mongoose.connection.close()
})