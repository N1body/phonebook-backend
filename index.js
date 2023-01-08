require('dotenv').config()
// 导入express模块
const express = require('express')
// 创建express实例
const app = express()
const path = require('path')
// 导入数据库中的persons集合
const Person = require('./modules/persons')

app.use(express.static(path.join(__dirname, 'build')))

// 中间件
app.use(express.json())

const cors = require('cors')
app.use(cors())

// 返回Info信息页面
app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const date = new Date()
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `)
  })
})

// 添加人员
app.post('/api/persons', (req, res) => {
  const body = req.body
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

// 获取所有人员
app.get('/api/persons', (req, res) => {
  // res.json(persons)
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// 获取单个人员
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    res.json(person)
  })
})

// 删除单个
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findByIdAndDelete(id).then(person => {
    res.status(204).end()
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'inknown endpoint' })
}
app.use(unknownEndpoint)

// 服务器端口
const PORT = process.env.PORT
// 监听端口
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\nAddress: http://localhost:${PORT}`)
})