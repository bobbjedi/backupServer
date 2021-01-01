const fs = require('fs');
const http = require('http');
const port = 3003;
const maxFilesOfProject = 50;

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

let host = 'xxx.xxx.xxx.xxx';
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

const clear = () => {
    const content = fs.readdirSync('./');
    content.forEach(c => {
        if (c.includes('.')) {
            return;
        }
        const dirName = './' + c + '/';
        const dirContent = fs.readdirSync(dirName);
        if (dirContent.length < maxFilesOfProject) {
            return console.log(c, 'count no enaut:' + dirContent.length);
        }
        dirContent.sort((f1, f2) => fs.statSync(dirName + f1).birthtimeMs - fs.statSync(dirName + f2).birthtimeMs);
        dirContent.splice(-50);
        console.log('Removed from', c, dirContent.length);
        dirContent.forEach(f => fs.unlinkSync(dirName + f));
    });
}
clear();
setInterval(clear, 3600 * 1000);
