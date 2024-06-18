import * as dgram from 'dgram';
import { Pacote } from '../Pacote';

export class UDPRemetente {
    private cliente: dgram.Socket;
    private numeroSequencia: number = 0;
    private pacotesEnviadosMap: Map<number, Pacote> = new Map();
    private tamanhoJanela: number = 5; // Tamanho máximo da janela de envio
    private enviarProximo: number = 0; // Próximo número de sequência a enviar
    private timeoutInterval: number = 2000; // Intervalo de tempo para aguardar ACK (em milissegundos)

    constructor(private host: string, private portaDestino: number, private portaOrigem?: number) {
        this.cliente = dgram.createSocket('udp4');
        if (this.portaOrigem) {
            this.cliente.bind(this.portaOrigem);
        }
        this.cliente.on('message', (msg) => this.handleAck(msg));
    }

    public send(data: string): void {
        if (this.enviarProximo < this.numeroSequencia + this.tamanhoJanela) {
            const pacote = new Pacote(this.enviarProximo, data);
            const mensagem = Buffer.from(JSON.stringify(pacote));
            this.pacotesEnviadosMap.set(this.enviarProximo, pacote);

            this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
                if (err) console.error(err);
                console.log(`O pacote de número de sequência ${this.enviarProximo} foi enviado com sucesso.`);
            });

            this.enviarProximo++;
            this.showWindow(); // Mostra a janela de envio após enviar

            // Aguarda o ACK para este pacote
            this.waitForAck(pacote);
        } else {
            console.log(`Janela de envio cheia. Não foi possível enviar pacote ${this.enviarProximo}`);
        }
    }

    private handleAck(msg: Buffer): void {
        const ack = parseInt(msg.toString());
        if (this.pacotesEnviadosMap.has(ack)) {
            this.pacotesEnviadosMap.delete(ack);
            console.log(`Received ACK for sequence number: ${ack}`);
        } else {
            console.log(`ACK recebido para pacote não enviado: ${ack}`);
        }
        this.showWindow(); // Mostra a janela de envio após receber ACK
    }

    private showWindow(): void {
        const pacotesEnviados = Array.from(this.pacotesEnviadosMap.keys()).sort((a, b) => a - b);
        console.log(`Pacotes na janela de envio: ${pacotesEnviados.join(', ')}`);
    }

    private waitForAck(pacote: Pacote): void {
        setTimeout(() => {
            if (this.pacotesEnviadosMap.has(pacote.numeroSequencia)) {
                console.log(`Timeout para o pacote de número de sequência ${pacote.numeroSequencia}. Reenviando...`);
                this.resendPacote(pacote);
            }
        }, this.timeoutInterval);
    }

    private resendPacote(pacote: Pacote): void {
        const mensagem = Buffer.from(JSON.stringify(pacote));
        this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
            if (err) console.error(err);
            console.log(`Reenviado pacote de número de sequência ${pacote.numeroSequencia}`);
        });

        // Reagenda espera por ACK para o pacote reenviado
        this.waitForAck(pacote);
    }
}
