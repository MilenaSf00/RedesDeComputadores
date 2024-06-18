"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPDestinatario = void 0;
// src/UDPReceiver.ts
var dgram = require("dgram"); // Importar dgram usando require() ao invés de import
var UDPDestinatario = /** @class */ (function () {
    function UDPDestinatario(porta) {
        var _this = this;
        this.porta = porta;
        this.numeroSequenciaEsperado = 0;
        this.server = dgram.createSocket('udp4');
        this.server.on('message', function (msg, rinfo) { return _this.handleMessage(msg, rinfo); }); // Corrigido 'mensagem' para 'message'
        this.server.bind(this.porta);
    }
    UDPDestinatario.prototype.handleMessage = function (msg, rinfo) {
        var pacote = JSON.parse(msg.toString()); // Corrigido 'Pacote' para 'pacote'
        if (pacote.numeroSequencia === this.numeroSequenciaEsperado) {
            console.log("Pacote recebido: ".concat(pacote.dado));
            this.sendAck(pacote.numeroSequencia, rinfo);
            this.numeroSequenciaEsperado++;
        }
        else {
            console.log("Pacote de n\u00FAmero de sequ\u00EAncia ".concat(pacote.numeroSequencia, " recebido fora da ordem."));
        }
    };
    UDPDestinatario.prototype.sendAck = function (numeroSequencia, rinfo) {
        var ack = Buffer.from(numeroSequencia.toString());
        this.server.send(ack, rinfo.port, rinfo.address, function (err) {
            if (err)
                console.error(err);
            console.log("Sent ACK for sequence number: ".concat(numeroSequencia));
        });
    };
    return UDPDestinatario;
}());
exports.UDPDestinatario = UDPDestinatario;
