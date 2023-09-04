const express = require( 'express' )
const morgan = require('morgan')
const app = express()
const cors = require( 'cors' )
require('dotenv').config()

const Person = require( './models' )

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}



app.use( express.json() )
app.use( cors() )
app.use(express.static('dist'))
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

morgan.token('body', (request, response) => {
  if (!request.body.name) return

  return JSON.stringify(request.body)
})


const persons = [
	{
		id: 1,
		name: 'Alieu Saidy',
		number: '220 5583 4321',
	},
	{
		id: 2,
		name: 'Mariama Saidy',
		number: '220 2233 9089',
	},
	{
		id: 3,
		name: 'Fatoumata Touray',
		number: '220 6640 2211',
	},
	{
		id: 4,
		name: 'Mariama Sowe',
		number: '220 7732 7030',
	},
]

app.get( '/api/persons', ( request, response ) => {
    Person.find( {} ).then( res => {
        response.json( {data:res} );        
    })
} )

app.get( '/api/persons/info', ( request, response, next ) => {
    Person.countDocuments().then( count => {
        response.send(
            `
            <p>The Phonebook has a info of ${count}</p>
            <p>${new Date()}</p>
            `
        )        
    }).catch(error => next(error))
} )

app.get( '/api/persons/:id', ( request, response, next ) => {
           
    Person.findById(request.params.id)
			.then((returnPerson) => {
				if (returnPerson) {
					response.status(200).json({ data: returnPerson })
				} else {
					response.status(404).json('No person found').end()
				}
			})
			.catch((error) => next(error))
} )

app.delete( '/api/persons/:id', ( request, response ) => {
    const id = request.params.id

    Person.findByIdAndDelete( id )
        .then( person => {
            if ( person ) {

            response.status(200).json({ data: 'person deleted' })
            } else {
                response.status( 404 ).json({data: 'No person found'}).end()
        }
        } )
        .catch( error => {
            next(error)
    })
} )

app.post( '/api/persons', ( request, response, next ) => {
    const {name, number} = request.body    

    if ( name !== undefined && number !== undefined) {        
                
        const newPerson = new Person({         
            name,
            number
        })

        newPerson.save()
            .then( returnedPerson => {
            response.status(201).json({ data: returnedPerson })
            } )
        .catch(error => next(error))
        
    } else {
        response.status(400).json({error: 'name or number is missing'})
    }
    
} )

app.put( '/api/persons/:id', ( request, response, next ) => {
    const { name, number } = request.body 
    console.log('body', name ,'', number);  

    Person.findByIdAndUpdate(
			request.params.id,
			{name, number},			
			{ new: true, runValidators: true, context: 'query' }
		)
			.then((updatedPerson) => {
				response.status(200).json({ data: updatedPerson })
			})
			.catch((error) => next(error))
})


app.use( unknownEndpoint )
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen( PORT, () => {
    console.log(`Server stated on ${PORT}`);
})

