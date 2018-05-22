if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://Max:bottega@ds215380.mlab.com:15380/gummycode'}
  
} else {
  module.exports = {mongoURI: 'mongodb://localhost/GUMMY_CODE_DEV'}
}