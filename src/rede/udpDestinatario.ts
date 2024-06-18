// src/UDPReceiver.ts
import dgram from 'dgram';
import { Pacote } from '../Pacote';

export class UDPDestinatario {
    private server: dgram.Socket;
    private numeroSequenciaEsperado: number = 0;

    constructor(private porta: number) {
        this.server = dgram.createSocket('udp4');
        this.server.on('mensagem', (msg, rinfo) => this.handleMessage(msg, rinfo));
        this.server.bind(this.porta);
    }

    private handleMessage(msg: Buffer, rinfo: dgram.RemoteInfo): void {
        const Pacote: Pacote = JSON.parse(msg.toString());
        if (Pacote.numeroSequencia === this.numeroSequenciaEsperado) {
            console.log(`Pacote recebido: ${Pacote.dado}`);
            this.sendAck(Pacote.numeroSequencia, rinfo);
            this.numeroSequenciaEsperado++;
        } else {
            console.log(`Pacote de número de sequência ${Pacote.numeroSequencia} recebido fora da ordem.`);
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
