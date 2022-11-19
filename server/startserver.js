const PORT = process.env.PORT || 8000


const app = require('./server')


app.listen(PORT, () => {
 
  console.log(`Server started on port ${ PORT }`)
}).on('error', err => {
  console.log('ERROR: ', err)
})

