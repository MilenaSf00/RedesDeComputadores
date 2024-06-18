// clienteTCP.js
const net = require('net');

const client = new net.Socket();
const PORTA = 3000;
const HOST = 'localhost';

client.connect(PORTA, HOST, () => {
    console.log(`Conectado ao servidor TCP em ${HOST}:${PORTA}`);

    console.time('tempo_envio_tcp');

    for (let i = 0; i < 1000; i++) {
        client.write(`Mensagem ${i}`);
    }

    client.end();
});

client.on('close', () => {
    console.timeEnd('tempo_envio_tcp');
    console.log('Conexão encerrada');
});
