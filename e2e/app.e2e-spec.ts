import { FinalSourgrapePage } from './app.po';

describe('final-sourgrape App', function() {
  let page: FinalSourgrapePage;

  beforeEach(() => {
    page = new FinalSourgrapePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
