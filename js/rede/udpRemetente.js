"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPRemetente = void 0;
const dgram_1 = __importDefault(require("dgram"));
const Pacote_1 = require("../Pacote");
const MAX_RETRIES = 5;
class UDPRemetente {
    
    constructor(host, portaDestino, portaOrigem) {
        this.host = host;
        this.portaDestino = portaDestino;
        this.portaOrigem = portaOrigem;
        this.numeroSequencia = 0;
        this.pacotesEnviadosMap = new Map();
        this.retriesMap = new Map();
        this.cliente = dgram_1.default.createSocket('udp4');
        if (this.portaOrigem) {
            this.cliente.bind(this.portaOrigem);
        }
        this.cliente.on('message', (msg) => this.handleAck(msg));
    }
    send(data) {
        const pacote = new Pacote_1.Pacote(this.numeroSequencia, data);
        const mensagem = Buffer.from(JSON.stringify(pacote));
        this.pacotesEnviadosMap.set(this.numeroSequencia, pacote);
        this.retriesMap.set(this.numeroSequencia, 0);
        this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
            if (err)
                console.error(err);
            console.log(`O pacote de número de sequência ${this.numeroSequencia} foi enviado com sucesso.`);
            this.numeroSequencia++;
        });
        this.waitForAck(pacote);
    }
    waitForAck(pacote) {
        const retries = this.retriesMap.get(pacote.numeroSequencia) || 0;
        setTimeout(() => {
            if (this.pacotesEnviadosMap.has(pacote.numeroSequencia)) {
                
                if (retries < MAX_RETRIES) {
                    this.retriesMap.set(pacote.numeroSequencia, retries + 1);
                    this.resendpacote(pacote, retries);
                }else {
                    console.error(`Pacote de número de sequência ${pacote.numeroSequencia} falhou após ${MAX_RETRIES} tentativas.`);
                    this.pacotesEnviadosMap.delete(pacote.numeroSequencia);
                    this.retriesMap.delete(pacote.numeroSequencia);
                }
            }
        }, 2000 * (retries + 1));
    }
    handleAck(msg) {
        const ack = parseInt(msg.toString());
        if (this.pacotesEnviadosMap.has(ack)) {
            this.pacotesEnviadosMap.delete(ack);
            console.log(`Received ACK for sequence number: ${ack}`);
        }
    }
    resendpacote(pacote, retries) {
        const mensagem = Buffer.from(JSON.stringify(pacote));
        this.cliente.send(mensagem, this.portaDestino, this.host, (err) => {
            if (err)
                console.error(err);
            console.log(`Resent pacote with sequence number: ${pacote.numeroSequencia} (retry ${retries + 1})`);
            this.waitForAck(pacote);
        });
    }
    // startSending() {

    //     for (let i = 0; i < 50; i++) {
    //         this.send(`Mensagem ${i}`);
    //     }
    // }

}
exports.UDPRemetente = UDPRemetente;
