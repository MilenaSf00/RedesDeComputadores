// src/UDPReceiver.ts
import * as dgram from 'dgram'; // Importar dgram usando require() ao invés de import
import { Pacote } from '../Pacote';

export class UDPDestinatario {
    private server: dgram.Socket;
    private numeroSequenciaEsperado: number = 0;

    constructor(private porta: number) {
        this.server = dgram.createSocket('udp4');
        this.server.on('message', (msg, rinfo) => this.handleMessage(msg, rinfo)); // Corrigido 'mensagem' para 'message'
        this.server.bind(this.porta);
    }

    private handleMessage(msg: Buffer, rinfo: dgram.RemoteInfo): void {
        const pacote: Pacote = JSON.parse(msg.toString()); // Corrigido 'Pacote' para 'pacote'
        if (pacote.numeroSequencia === this.numeroSequenciaEsperado) {
            console.log(`Pacote recebido: ${pacote.dado}`);
            this.sendAck(pacote.numeroSequencia, rinfo);
            this.numeroSequenciaEsperado++;
        } else {
            console.log(`Pacote de número de sequência ${pacote.numeroSequencia} recebido fora da ordem.`);
        }
    }

    private sendAck(numeroSequencia: number, rinfo: dgram.RemoteInfo): void {
        const ack = Buffer.from(numeroSequencia.toString());
        this.server.send(ack, rinfo.port, rinfo.address, (err) => {
            if (err) console.error(err);
            console.log(`Sent ACK for sequence number: ${numeroSequencia}`);
        });
    }
}
