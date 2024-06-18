"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const udpRemetente_1 = require("./rede/udpRemetente");
const sender = new udpRemetente_1.UDPRemetente('localhost', 41235, 12345);
sender.send('Hello, World!');