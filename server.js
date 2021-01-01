const fs = require('fs');
const http = require('http');
const port = 3003;

let server = new http.Server(function ({url}, res) {
    try {
        if (url.includes('backup=')) {
            const fileUrl = url.split('backup=')[1];
            const splits = fileUrl.split('\/');
            const fileName = splits[splits.length - 1];
            const dirName = splits[splits.length - 2];
            
            !fs.existsSync(dirName) && fs.mkdirSync(dirName);
            
            downLoad(fileUrl.replace(dirName, ''), dirName + '/' + fileName);
            res.end('Ok');
            return;
        }
    }catch(e){
        console.log('Error:', e);
        return res.end('500! ' + e);
    }
   
    res.end('404!');
});

let host = 'xxx.xxx.xxx.xxx'; // current vps ip
server.listen(port, host);
console.info('backup Serever started', 'http://localhost:' + port);

const downLoad = (url, fileName) => {
    console.log({url, fileName})
    var request = http.get(url, response => {
        if (response.statusCode === 200) {
            var file = fs.createWriteStream(fileName);
            response.pipe(file);
        }
        // Add timeout.
        request.setTimeout(12000, function () {
            request.abort();
        });
    });
} 
