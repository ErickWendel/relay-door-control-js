# Relay Door Control

# Running 

- You mush flash the Espruino program on your ESP01. 
- Connect it on your computer. `
- Run `ls /dev/tty.*` find the device port (something like `/dev/tty.wchusbserial14620`)
- Change `PORT` variable on [flash.sh](./flash.sh)
- Change the [package.json](./package.json) adding your device port
- Run `sh flash.sh`
- Add your Wireless `user` and `password` on [index.js](./index.js)
- Run `npm install`
- Run `npm run upload:usb`


# Setting Hostname manually

- Run `npm run shell:usb` to access the device
- Paste the following JS Code

```js
const Wifi = require('wifi')
Wifi.setHostname('myHostName')
Wifi.save()
```

- Then from other terminal instance, run `ping myHostName` to check if it works
