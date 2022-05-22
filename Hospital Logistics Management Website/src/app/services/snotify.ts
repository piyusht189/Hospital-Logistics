// Angular Imports
import { Injectable } from "@angular/core";
import {
    SnotifyService,
    SnotifyPosition,
    SnotifyToastConfig
} from "ng-snotify";

@Injectable()
export class notifyService {
    style = "material";
    title = "Snotify title!";
    body = "Lorem ipsum dolor sit amet!";
    timeout = 3000;
    timeoutlong = 99999999999999999999;
    position: SnotifyPosition = SnotifyPosition.rightTop;
    positioncc: SnotifyPosition = SnotifyPosition.centerCenter;
    progressBar = false;
    closeClick = true;
    newTop = true;
    filterDuplicates = false;
    backdrop = -1;
    dockMax = 8;
    blockMax = 6;
    pauseHover = true;
    titleMaxLength = 165;
    bodyMaxLength = 900;
    constructor(
        private snotifyService: SnotifyService
    ) { }
    getConfig(): SnotifyToastConfig {
        this.snotifyService.setDefaults({
            global: {
                newOnTop: this.newTop,
                maxAtPosition: this.blockMax,
                maxOnScreen: this.dockMax
                // filterDuplicates: this.filterDuplicates
            }
        });
        return {
            bodyMaxLength: this.bodyMaxLength,
            titleMaxLength: this.titleMaxLength,
            backdrop: this.backdrop,
            position: this.position,
            timeout: this.timeout,
            showProgressBar: this.progressBar,
            closeOnClick: this.closeClick,
            pauseOnHover: this.pauseHover
        };
    }
    getConfigLong(): SnotifyToastConfig {
        this.snotifyService.setDefaults({
            global: {
                newOnTop: this.newTop,
                maxAtPosition: this.blockMax,
                maxOnScreen: this.dockMax
                // filterDuplicates: this.filterDuplicates
            }
        });
        return {
            bodyMaxLength: this.bodyMaxLength,
            titleMaxLength: this.titleMaxLength,
            backdrop: this.backdrop,
            position: this.position,
            timeout: this.timeoutlong,
            showProgressBar: this.progressBar,
            closeOnClick: this.closeClick,
            pauseOnHover: this.pauseHover
        };
    }
    getConfigPrompt(link,email): SnotifyToastConfig {
        this.snotifyService.setDefaults({
            global: {
                newOnTop: this.newTop,
                maxAtPosition: this.blockMax,
                maxOnScreen: this.dockMax
                // filterDuplicates: this.filterDuplicates
            }
        });
        return {
            bodyMaxLength: this.bodyMaxLength,
            titleMaxLength: this.titleMaxLength,
            backdrop: this.backdrop,
            position: this.position,
            timeout: 60000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            buttons: [
                { text: 'Resend Verification Link', action: () => { window.open(link + '/' + email, '_self') }, bold: true },
                { text: 'Close', action: (toast) => { this.snotifyService.remove(toast.id); }, bold: false },
            ]
        };
    }
    getLoginPrompt(): SnotifyToastConfig {
        this.snotifyService.setDefaults({
            global: {
                newOnTop: this.newTop,
                maxAtPosition: this.blockMax,
                maxOnScreen: this.dockMax
                // filterDuplicates: this.filterDuplicates
            }
        });
        return {
            bodyMaxLength: this.bodyMaxLength,
            titleMaxLength: this.titleMaxLength,
            backdrop: this.backdrop,
            position: this.position,
            timeout: 12000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            buttons: [
                { text: 'Login', action: () => { window.open('/') }, bold: true },
                { text: 'Close', action: (toast) => { this.snotifyService.remove(toast.id); }, bold: false },
            ]
        };
    }

    getSubscribePrompt(): SnotifyToastConfig {
        this.snotifyService.setDefaults({
            global: {
                newOnTop: this.newTop,
                maxAtPosition: this.blockMax,
                maxOnScreen: this.dockMax
                // filterDuplicates: this.filterDuplicates
            }
        });
        return {
            bodyMaxLength: this.bodyMaxLength,
            titleMaxLength: this.titleMaxLength,
            backdrop: this.backdrop,
            position: this.positioncc,
            timeout: 12000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            buttons: [
                { text: 'Subscribe', action: () => { window.open('/pricing') }, bold: true },
                { text: 'Close', action: (toast) => { this.snotifyService.remove(toast.id); }, bold: false },
            ]
        };
    }
    //Change
    onSuccess(title, msg) {
        if (title !== "Welcome") {
        }
        this.snotifyService.success(msg, title, this.getConfig());
    }
    onSuccessLong(title, msg){
        this.snotifyService.success(msg, title, this.getConfigLong());
    }
    onInfo(title, msg) {
        this.snotifyService.info(msg, title, this.getConfig());
    }
    onError(title, msg) {
        this.snotifyService.error(msg, title, this.getConfig());
    }
    onWarning(title, msg) {
        this.snotifyService.warning(msg, title, this.getConfig());
    }
    onPrompt(link,email) {
        this.snotifyService.confirm('Check for email with verification link we have already sent or','Account not verified!', this.getConfigPrompt(link,email));


    }
    
    onPromptLogin() {
        this.snotifyService.confirm('Do you want to login?', 'Already Registered?', this.getLoginPrompt());


    }
    onPromptSubscribe() {
        this.snotifyService.confirm('To continue searching, subscribe to ImportKey', 'Search Limit Exceeded', this.getSubscribePrompt());


    }

    onSimple() {
        // const icon = `assets/custom-svg.svg`;
        const icon = `https://placehold.it/48x100`;

        this.snotifyService.simple(this.body, this.title, {
            ...this.getConfig(),
            icon: icon
        });
    }



}
