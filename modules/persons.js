// 导入mongoose工具库
const mongoose = require('mongoose')

// 连接地址
const url = process.env.MONGODB_URI

console.log('connecting...')

// 连接数据库
mongoose.connect(url)
  .then(res => {
    console.log('connected to MongoDb')
  })
  .catch(err => {
    console.log('error connecting to MongoDB:', err.message)
  })

// 选择模式
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

// 设置返回
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
    delete returnedObject.__v
  }
})

// 导出模式
module.exports = mongoose.model('person', personSchema)