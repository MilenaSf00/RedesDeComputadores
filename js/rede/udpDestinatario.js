"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPDestinatario = void 0;
const dgram_1 = __importDefault(require("dgram"));
class UDPDestinatario {
    constructor(porta) {
        this.porta = porta;
        this.numeroSequenciaEsperado = 0;
        this.server = dgram_1.default.createSocket('udp4');
        this.server.on('message', (msg, rinfo) => this.handleMessage(msg, rinfo)); // Note the correct event name 'message'
        this.server.bind(this.porta);
    }
    handleMessage(msg, rinfo) {
        const pacote = JSON.parse(msg.toString());
        if (pacote.numeroSequencia === this.numeroSequenciaEsperado) {
            console.log(`Pacote recebido: ${pacote.dado}`);
            this.sendAck(pacote.numeroSequencia, rinfo);
            this.numeroSequenciaEsperado++;
        }
        else {
            console.log(`Pacote de número de sequência ${pacote.numeroSequencia} recebido fora da ordem.`);
        }
    }
    sendAck(numeroSequencia, rinfo) {
        const ack = Buffer.from(numeroSequencia.toString());
        this.server.send(ack, rinfo.port, rinfo.address, (err) => {
            if (err)
                console.error(err);
            console.log(`ACK enviado para pacote de número de sequência igual a: ${numeroSequencia}`);
        });
    }
}
exports.UDPDestinatario = UDPDestinatario;
