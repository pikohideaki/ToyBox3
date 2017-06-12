import { ToyBox3Page } from './app.po';

describe('toy-box3 App', () => {
  let page: ToyBox3Page;

  beforeEach(() => {
    page = new ToyBox3Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
