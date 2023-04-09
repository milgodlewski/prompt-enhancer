import { TextRefiner } from './textRefiner.js';

class App {
  private textRefiner: TextRefiner;
  private refineButton: HTMLElement | null;

  constructor() {
    this.textRefiner = new TextRefiner();
    this.refineButton = document.getElementById('refineButton');
  }

  public async init(): Promise<void> {
    try {
      await this.textRefiner.populateModelSelection();
      this.configureEventListeners();
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  private configureEventListeners(): void {
    if (this.refineButton) {
      this.refineButton.addEventListener('click', (event) => this.handleRefineButtonClick(event));
      console.log('Refine button event listener added');
    } else {
      console.error('Refine button not found in DOM');
    }
  }

  private async handleRefineButtonClick(event: Event): Promise<void> {
    event.preventDefault();
    console.log('Refine button clicked');

    try {
      await this.textRefiner.refineText();
    } catch (error) {
      console.error('Error refining text:', error);
      alert('An error occurred while refining the text. Please try again.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
