const cors = require('cors');
const fs = require('fs-extra');
const formidable = require('formidable');
const express = require('express')
const app = express()
const port = 3000

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.post('/fileupload', (req, res) => {

    const path = './client/public/upload/';

    var form = new formidable.IncomingForm();
    form.uploadDir = path;
    form.encoding = 'binary';

    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
            res.send('upload failed')
        } else {
            var oldpath = files.files.path;
            var newpath = path + files.files.name;
            fs.rename(oldpath, newpath, function(err) {
                if (err) throw err;
                res.send('complete').end();
            });
        }
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log('Open http://localhost:3000/')
})