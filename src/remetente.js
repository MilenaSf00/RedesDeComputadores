"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var udpRemetente_1 = require("./rede/udpRemetente");
var sender = new udpRemetente_1.UDPRemetente('localhost', 41234, 12345);
sender.send('Hello, World!');
