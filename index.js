// 导入express模块
const express = require('express')
// 创建express实例
const app = express()
const path = require('path')
app.use(express.static(path.join(__dirname, 'build')))

// 中间件
app.use(express.json())

const cors = require('cors')
app.use(cors())


// JSON数据
let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "Arto Hellas"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "Ada Lovelace"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "Dan Abramov"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "Mary Poppendieck"
  }
]

// 返回Info信息页面
app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// 添加人员
app.post('/api/persons', (req, res) => {
  const person = req.body
  persons = persons.concat({
    ...person,
    id: person.name
  })
  res.json(person)
})

// 获取所有人员
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 获取单个人员
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
    return
  }
  res.status(404).end()
})

// 删除单个
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'inknown endpoint' })
}
app.use(unknownEndpoint)

// 服务器端口
const PORT = 3001
// 监听端口
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\nAddress: http://localhost:${PORT}`)
})