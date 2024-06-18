import { UDPRemetente } from './rede/udpRemetente';

const sender = new UDPRemetente('localhost', 41234, 12345);
sender.send('Hello, World!');
