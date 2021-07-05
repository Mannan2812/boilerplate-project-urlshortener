const express = require('express')
var bodyParser = require('body-parser')
const app = express()
var url_to_key = {}
var key_to_url = {}

var idx = 1
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : false
}))

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

app.route('/api/shorturl').post( (req, res) => {
    url_input = req.body.url
    var ans = validURL(url_input)
    if(!validURL(url_input))
    {
        return res.json({
            "error" : "invalid url"
        })
    }
    else if (!(url_input in url_to_key))
    {
        url_to_key[url_input] = idx
        key_to_url[idx] = url_input
        ++idx
    }
    res.json({
        'original_url' : url_input,
        'short_url' : url_to_key[url_input]
    })
})

app.get('/api/shorturl/:idx', (req,res) => {
    url_key = req.params.idx
    console.log(key_to_url[url_key])
    res.redirect(key_to_url[url_key])
})

module.exports = app