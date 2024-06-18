"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPRemetente = void 0;
const dgram_1 = __importDefault(require("dgram"));
const Pacote_1 = require("../Pacote");
class UDPRemetente {
    constructor(host, portaDestino, portaOrigem) {
        this.host = host;
        this.portaDestino = portaDestino;
        this.portaOrigem = portaOrigem;
        this.numeroSequencia = 0;
        this.pacotesEnviadosMap = new Map();
        this.cliente = dgram_1.default.createSocket('udp4');
        if (this.portaOrigem) {
            this.cliente.bind(this.portaOrigem);
        }
        this.cliente.on('mensagem', (msg) => this.handleAck(msg));
    }
    send(data) {
        const pacote = new Pacote_1.Pacote(this.numeroSequencia, data);
        const mensagem = Buffer.from(JSON.stringify(pacote));
        this.pacotesEnviadosMap.set(this.numeroSequencia, pacote);
        this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
            if (err)
                console.error(err);
            console.log(`O pacote de número de sequência ${this.numeroSequencia} foi enviado com sucesso.`);
            this.numeroSequencia++;
        });
        this.waitForAck(pacote);
    }
    waitForAck(pacote) {
        setTimeout(() => {
            if (this.pacotesEnviadosMap.has(pacote.numeroSequencia)) {
                this.resendpacote(pacote);
            }
        }, 2000);
    }
    handleAck(msg) {
        const ack = parseInt(msg.toString());
        if (this.pacotesEnviadosMap.has(ack)) {
            this.pacotesEnviadosMap.delete(ack);
            console.log(`Received ACK for sequence number: ${ack}`);
        }
    }
    resendpacote(pacote) {
        const mensagem = Buffer.from(JSON.stringify(pacote));
        this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
            if (err)
                console.error(err);
            console.log(`Resent pacote with sequence number: ${pacote.numeroSequencia}`);
            this.waitForAck(pacote);
        });
    }
}
exports.UDPRemetente = UDPRemetente;
