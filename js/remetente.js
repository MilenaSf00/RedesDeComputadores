"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const udpRemetente_1 = require("./rede/udpRemetente");
const sender = new udpRemetente_1.UDPRemetente('localhost', 65343, 56803);
const mensagens = [
    'Lorem Ipsum is simply dummy',
    'has been the industry',
    'he 1960s with the release of Letraset sheets',
    'Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here',
    '1234567',
    '9-0-0-1-09'
];
mensagens.forEach(msg => sender.send(msg));
