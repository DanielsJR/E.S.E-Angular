import { LocalStorageService } from './services/local-storage.service';
import { BROKER_URL } from './app.config';
import { Injectable } from '@angular/core';

//@Injectable()
export class MyStomp {


    brokerURL = BROKER_URL;
    connectHeaders = {};
    heartbeatIncoming = 0; // Typical value 0 - disabled
    heartbeatOutgoing = 20000; // Typical value 20000 - every 20 seconds
    reconnectDelay = 500;

    constructor(private localStorageService: LocalStorageService) {

        this.connectHeaders = {
            'Authorization': 'Bearer ' + this.localStorageService.getToken(),
        };

    }

    debug = (msg: string): void => {
        console.log(new Date(), msg);
    }


}

