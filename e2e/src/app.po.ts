import { browser } from 'protractor';

export class AppPage {

    navigateTo() {
        return browser.get('/');
    }

    getTitle() {
        return browser.getTitle();
    }

    getCurrentUrl() {
        return browser.getCurrentUrl();
    }
}
