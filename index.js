require('dotenv').config()
// 导入express模块
const express = require('express')
// 创建express实例
const app = express()
const path = require('path')
// 导入数据库中的persons集合
const Person = require('./modules/persons')
// 跨域模块
const cors = require('cors')

// 自定义中间件
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// 中间件
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))
app.use(requestLogger)

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
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

// 删除单个
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(person => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'inknown endpoint' })
}
app.use(unknownEndpoint)

// 错误处理
const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

// 服务器端口
const PORT = process.env.PORT
// 监听端口
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\nAddress: http://localhost:${PORT}`)
})