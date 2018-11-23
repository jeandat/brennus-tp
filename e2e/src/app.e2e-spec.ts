import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('brennus-tp app', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitle()).toEqual('Brennus Analytics');
  });
});
