const http = require('http');
const Wifi = require("Wifi");
const WIFI_NAME = "Erick Wendel";
const WIFI_OPTIONS = { password: "" };

const relayPin = 2;//D7;

// const URL = 'http://192.168.15.72:1880/lightSensor';
// const incomingPassword = "H-random-0.,x";
const TOKEN = '0bb14ac18a2cab7d01d69a3f65e5c7ee1272c';

function promisify(fn, args) {
    return new Promise((resolve, reject) => {
        const cbFn = (err, res) => err ? reject(err) : resolve(res);
        const finalArgs = args.concat(cbFn);
        return fn.apply(this, finalArgs);
    });
}

function connectWifi(alreadyConnected) {
    if (alreadyConnected) return;
    return Promise.resolve()
        .then(() => promisify(Wifi.connect, [WIFI_NAME, WIFI_OPTIONS]));
}

function postJSON(postURL, data) {
    const content = JSON.stringify(data);
    const options = url.parse(postURL);
    options.method = 'POST';
    options.headers = {
        "Content-Type": "application/json",
        "Content-Length": content.length
    };

    return new Promise((resolve, reject) => {

        const req = http.request(options, function (res) {
            let d = "";
            res.on('data', (data) => d += data);
            res.on('close', resolve);
        });
        req.on('error', reject);
        req.end(content);
    });

}

function handleWifi() {
    const wifiStatus = Wifi.getStatus();
    const alreadyConnected = wifiStatus.station == "connected";
    if (wifiStatus.station === 'connecting') {
        console.log('trying to connect to Wifi..');
        return;
    }

    return Promise.resolve()
        .then(() => connectWifi(alreadyConnected))
        .catch(error => {
            console.log('Deu Ruim', error);
            if (!error) return;
            console.log('Deu Ruim', error.stack);
        });

}
function timeout(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function activateRelay(delay) {
    return Promise.resolve()
        .then(() => digitalWrite(relayPin, HIGH))
        .then(() => console.log('locker on'))
        .then(() => timeout(delay))
        .then(() => console.log('locker off!'))
        .then(() => digitalWrite(relayPin, LOW));
}

function startServer() {
    return new Promise((resolve, reject) => {

        http.createServer((request, response) => {
            console.log('request arrived!', request.url);
            if(!request.url.includes(`TOKEN=${TOKEN}`)) {
                response.writeHead(401)
                response.end("unauthorized!");
                return;
            }

            if (request.url.includes("/locker")) {
                response.writeHead(200);

                response.write('locker activated!');
                response.end();

                activateRelay(1000);
                return;
            }

            response.end('Hi!');
            return;
        })
            .listen(80)
            .on('error', (msg) => {
                console.log('error on initializing server', msg);
                reject(msg)
            })

        setTimeout(resolve, 500);
    })

}

function initialize() {
    return Promise.resolve()
        .then(() => handleWifi())
        .then(() => console.log(`I'm running at http://${Wifi.getIP().ip}:80 and http://${Wifi.getHostname()}:80`))
        .then(() => startServer())
        
        .catch((error) => {
            console.log('error', error);
            console.log('error detail', { message: error.message, statck: error.stack });
            const timeoutDelay = 1000;
            console.log('rebooting...');
            setTimeout(() => E.reboot(), timeoutDelay);
        });
}
function onInit() {
    Wifi.stopAP();
    initialize();
}

// http://doorcontroller/locker?TOKEN=0bb14ac18a2cab7d01d69a3f65e5c7ee1272c