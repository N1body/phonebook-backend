const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password: node mongo.js <password>')
  process.exit(1)
} 

const password = process.argv[2]
const name = process.argv.length === 5 ? process.argv[3] : ''
const number = process.argv.length === 5 ? process.argv[4] : ''

const url = `mongodb+srv://root:${password}@cluster0.hlknkow.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name,
  number,
})

if (name) {
  person.save().then(res => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(res => {
    console.log('phonebook:')
    res.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
