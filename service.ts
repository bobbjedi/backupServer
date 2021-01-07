
const port = 3004;

//config
const myHost = 'xxx.xxx.xxx.xxx';
const savedUrl = 'http://xx.xxx.xxx.xx:3003/backup=';
const pName = 'prj';

const myUrl = 'http://' + myHost + ':' + port;
const urlName = '/qwerty/';

const reservServerBackup = async (fileName: string) => {
    try {
        const result = (await axios(savedUrl + myUrl + urlName + (pName || 'unknown') + '/' + fileName)).data;
        log.info('BackUp reserve saved: ' + result);
    } catch (e) {
        log.error('reservServerBackup ' + e);
    }
}

import * as express from 'express';
import {Express} from 'express';
const app:Express = express();
app.use(urlName, express.static(dirName));
app.listen(port, () => log.info('Backup Server listening on port ' + port + ' http://localhost:' + port));
