"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPDestinatario = void 0;
// src/UDPReceiver.ts
const dgram_1 = __importDefault(require("dgram"));
class UDPDestinatario {
    constructor(porta) {
        this.porta = porta;
        this.numeroSequenciaEsperado = 0;
        this.server = dgram_1.default.createSocket('udp4');
        this.server.on('mensagem', (msg, rinfo) => this.handleMessage(msg, rinfo));
        this.server.bind(this.porta);
    }
    handleMessage(msg, rinfo) {
        const Pacote = JSON.parse(msg.toString());

        // if (Math.random() < 0.2) {
        //     console.log(`Pacote de número de sequência ${pacote.numeroSequencia} ignorado para simulação de congestionamento.`);
        //     return;
        // }
        if (Pacote.numeroSequencia === this.numeroSequenciaEsperado) {
            console.log(`Pacote recebido: ${Pacote.dado}`);
            this.sendAck(Pacote.numeroSequencia, rinfo);
            this.numeroSequenciaEsperado++;
        }
        else {
            console.log(`Pacote de número de sequência ${Pacote.numeroSequencia} recebido fora da ordem.`);
        }
    }
    sendAck(numeroSequencia, rinfo) {
        const ack = Buffer.from(numeroSequencia.toString());
        this.server.send(ack, rinfo.port, rinfo.address, (err) => {
            if (err)
                console.error(err);
            console.log(`Sent ACK for sequence number: ${numeroSequencia}`);
        });
    }
}
exports.UDPDestinatario = UDPDestinatario;
