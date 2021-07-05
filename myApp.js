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

function validURL(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}



app.route('/api/shorturl').post( (req, res) => {
    url_input = req.body.url
    var ans = validURL(url_input)
    if(!validURL(url_input))
    {
        return res.json({
            error : "invalid url"
        })
    }
    else if (!(url_input in url_to_key))
    {
        url_to_key[url_input] = idx
        key_to_url[idx] = url_input
        ++idx
    }
    res.json({
        original_url : url_input,
        short_url : url_to_key[url_input]
    })
})

app.get('/api/shorturl/:idx', (req,res) => {
    url_key = req.params.idx
    console.log(key_to_url[url_key])
    res.redirect(key_to_url[url_key])
})

module.exports = app