import * as dgram from 'dgram';
import { Pacote } from '../Pacote';

export class UDPDestinatario {
    private server: dgram.Socket;
    private numeroSequenciaEsperado: number = 0;
    private tamanhoJanela: number = 2; // Tamanho máximo da janela de recebimento
    private pacotesRecebidos: Pacote[] = []; // Lista de pacotes recebidos
    private totalPacotesRecebidos: number = 0; // Total de pacotes recebidos

    constructor(private porta: number) {
        this.server = dgram.createSocket('udp4');
        this.server.on('message', (msg, rinfo) => this.handleMessage(msg, rinfo));
        this.server.bind(this.porta);
    }

    private handleMessage(msg: Buffer, rinfo: dgram.RemoteInfo): void {
        const pacote: Pacote = JSON.parse(msg.toString());
        
        if (pacote.numeroSequencia >= this.numeroSequenciaEsperado &&
            pacote.numeroSequencia < this.numeroSequenciaEsperado + this.tamanhoJanela) {
            if (!this.pacotesRecebidos.some(p => p.numeroSequencia === pacote.numeroSequencia)) {
                this.pacotesRecebidos.push(pacote);
                this.totalPacotesRecebidos++;
                console.log(`Pacote recebido: ${pacote.dado}`);
                this.sendAck(pacote.numeroSequencia, rinfo);

                // Simulação de processamento de pacote
                setTimeout(() => {
                    this.processReceivedPackets();
                }, 1000); // Processar a cada 1 segundo
            } else {
                console.log(`Pacote de número de sequência ${pacote.numeroSequencia} já foi recebido.`);
            }
        } else {
            console.log(`Pacote de número de sequência ${pacote.numeroSequencia} fora da janela de recebimento.`);
        }
    }

    private sendAck(numeroSequencia: number, rinfo: dgram.RemoteInfo): void {
        const ack = Buffer.from(numeroSequencia.toString());
        this.server.send(ack, rinfo.port, rinfo.address, (err) => {
            if (err) console.error(err);
            console.log(`Sent ACK for sequence number: ${numeroSequencia}`);
        });
    }

    private processReceivedPackets(): void {
        if (this.pacotesRecebidos.length > 0) {
            console.log(`Pacotes recebidos: ${this.pacotesRecebidos.map(p => p.numeroSequencia).join(', ')}`);
            console.log(`Total de pacotes recebidos até agora: ${this.totalPacotesRecebidos}`);
            console.log(`Processando ${this.pacotesRecebidos.length} pacotes.`);
            this.pacotesRecebidos = []; // Limpa a lista após processar
        } else {
            console.log(`Nenhum pacote para processar.`);
        }
    }
}
