var http = require('http'); 
var fs = require('fs'); 
var formidable = require('formidable'); 
 
// 包含上传表单的html文件
var upload_html = fs.readFileSync("index.html"); 
 
http.createServer(function (req, res) { 
    if (req.url == '/uploadform') { 
      res.writeHead(200); 
      res.write(upload_html); 
      return res.end(); 
    } else if (req.url == '/fileupload') { 
        var form = new formidable.IncomingForm(); 
          //Process the file upload in Node
        form.parse(req, function (error, fields, file) {
            let filepath = file.fileupload.filepath;
            let newpath = 'C:/upload-example/';
            newpath += file.fileupload.originalFilename;

            //Copy the uploaded file to a custom folder
            fs.rename(filepath, newpath, function () {
            //Send a NodeJS file upload confirmation message
            res.write('NodeJS File Upload Success!');
            res.end();
            });
        });

    }  
 }).listen(8086);
