// servidorUDP.js
const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    console.log(`Mensagem recebida do cliente ${rinfo.address}:${rinfo.port} - ${msg}`);
});

const PORTA = 41234;
server.bind(PORTA, () => {
    console.log(`Servidor UDP ouvindo na porta ${PORTA}`);
});
