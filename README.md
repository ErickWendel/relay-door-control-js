# Relay Door Control

# Running 

- You mush flash the Espruino program on your ESP01. 
- Connect it on your computer. `
- Run `ls /dev/tty.*` find the device port (something like `/dev/tty.wchusbserial14620`)
- Change `PORT` variable on [flash.sh](./flash.sh)
- Run `sh flash.sh`
- Add your Wireless `user` and `password` on [index.js](./index.js)
- Run `npm install`
- Run `npm run upload:usb`
