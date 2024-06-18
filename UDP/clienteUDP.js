// clienteUDP.js
const dgram = require('dgram');

const client = dgram.createSocket('udp4');
const PORTA = 41234;
const HOST = 'localhost';

// Array para armazenar os tempos de envio das mensagens
const temposEnvio = [];

client.on('message', (msg, rinfo) => {
    console.log(`Mensagem recebida do servidor ${rinfo.address}:${rinfo.port} - ${msg}`);
});

client.on('close', () => {
    console.log('Cliente UDP encerrado');
});

// Enviar 1000 mensagens
for (let i = 0; i < 1000; i++) {
    const mensagem = `Mensagem ${i}`;
    const buffer = Buffer.from(mensagem);

    // Marcar o tempo de início do envio
    const tempoInicio = process.hrtime.bigint();

    client.send(buffer, 0, buffer.length, PORTA, HOST, (err) => {
        if (err) throw err;
        console.log(`Mensagem enviada para ${HOST}:${PORTA} - ${mensagem}`);

        // Marcar o tempo de fim do envio dentro do callback de send
        const tempoFim = process.hrtime.bigint();
        const tempoNanosegundos = Number(tempoFim - tempoInicio) / 1e6;
        console.log(`Tempo de envio: ${tempoNanosegundos.toFixed(2)} ms`);
    });

    temposEnvio.push(tempoInicio); // Armazenar tempo de início para cálculo do tempo final
}

// Fechar o cliente após o envio das mensagens
setTimeout(() => {
    client.close();
}, 1000); // Aguardar 1 segundo para receber possíveis respostas do servidor
