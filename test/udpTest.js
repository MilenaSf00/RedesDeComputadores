const { describe, it, before, after } = require('mocha');
const path = require('path');
const dgram = require('dgram');

describe('UDP Congestion Simulation', function() {
    this.timeout(30000); 

    let remetente, destinatario, server;

    before(async function() {
        try {
            const { expect } = await import('chai');
            global.expect = expect;

            const udpRemetentePath = path.join(__dirname, '../js/rede/udpRemetente');
            const udpDestinatarioPath = path.join(__dirname, '../js/rede/udpDestinatario');

            const { UDPRemetente } = require(udpRemetentePath);
            const { UDPDestinatario } = require(udpDestinatarioPath);
            

            if (server) server.close();
            if (destinatario && destinatario.server) destinatario.server.close();
            if (remetente && remetente.cliente) remetente.cliente.close();

            destinatario = new UDPDestinatario(41235);
            remetente = new UDPRemetente('127.0.0.1', 41235, 12345);

            server = dgram.createSocket('udp4');
            server.on('message', (msg, rinfo) => {
                const ack = parseInt(msg.toString());
                console.log(`Test server received ACK for sequence number: ${ack}`);
            });
            server.bind(41236);
        } catch (err) {
            console.error('Error during setup:', err);
            done(err); 
        }
    });

    after(() => {
        try {
            if (server) server.close();
            if (destinatario && destinatario.server) destinatario.server.close();
            if (remetente && remetente.cliente) remetente.cliente.close();
        } catch (err) {
            console.error('Error during teardown:', err);
            done(err);
        }
    });

    it('should handle congestion by retransmitting lost packets', (done) => {
        remetente.send('Mensagem de teste 1');
        remetente.send('Mensagem de teste 2');
        remetente.send('Mensagem de teste 3');

        setTimeout(() => {
            
            done();
        }, 25000);
    });
});
