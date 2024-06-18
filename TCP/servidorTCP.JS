// servidorTCP.js
const net = require('net');

const server = net.createServer((socket) => {
    console.log('Cliente conectado:', socket.remoteAddress, socket.remotePort);

    socket.on('data', (data) => {
        console.log(`Mensagem recebida do cliente: ${data}`);
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });
});

const PORTA = 3000;
server.listen(PORTA, () => {
    console.log(`Servidor TCP ouvindo na porta ${PORTA}`);
});
