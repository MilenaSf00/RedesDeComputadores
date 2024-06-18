import dgram from 'dgram';
import { Pacote } from '../Pacote';

export class UDPRemetente {
    private cliente: dgram.Socket;
    private numeroSequencia: number = 0;
    private pacotesEnviadosMap: Map<number, Pacote> = new Map();

    constructor(private host: string, private portaDestino: number, private portaOrigem?: number) {
        this.cliente = dgram.createSocket('udp4');
        if (this.portaOrigem) {
            this.cliente.bind(this.portaOrigem);
        }
        this.cliente.on('mensagem', (msg) => this.handleAck(msg));
    }

    public send(data: string): void {
        const pacote = new Pacote(this.numeroSequencia, data);
        const mensagem = Buffer.from(JSON.stringify(pacote));
        this.pacotesEnviadosMap.set(this.numeroSequencia, pacote);
        this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
            if (err) console.error(err);
            console.log(`O pacote de número de sequência ${this.numeroSequencia} foi enviado com sucesso.`);
            this.numeroSequencia++;
        });

        this.waitForAck(pacote);
    }

    private waitForAck(pacote: Pacote): void {
        setTimeout(() => {
            if (this.pacotesEnviadosMap.has(pacote.numeroSequencia)) {
                this.resendpacote(pacote);
            }
        }, 2000);
    }

    private handleAck(msg: Buffer): void {
        const ack = parseInt(msg.toString());
        if (this.pacotesEnviadosMap.has(ack)) {
            this.pacotesEnviadosMap.delete(ack);
            console.log(`Received ACK for sequence number: ${ack}`);
        }
    }

    private resendpacote(pacote: Pacote): void {
        const mensagem = Buffer.from(JSON.stringify(pacote));
        this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
            if (err) console.error(err);
            console.log(`Resent pacote with sequence number: ${pacote.numeroSequencia}`);
            this.waitForAck(pacote);
        });
    }
}
