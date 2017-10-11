import template from './template.html';

export default class Search {

  constructor(element, onChangeHandler) {

    this.rootElement = element;
    this.onChangeHandler = onChangeHandler;

    this.state = {
      filter: null
    };

    this.setFilter = this.setFilter.bind(this);

  }

  create() {

    // create a temporary wrapper and give it the component template
    const container = document.createElement('div');
    container.innerHTML = template;


    const input = container.querySelector('input');

    input.value = this.state.query || '';

    input.addEventListener('keyup', (e) => {
      this.setFilter(e.target.value);
    });

    this.rootElement.appendChild(container.firstChild);

  }


  setFilter(str) {

    this.state.filter = (str === '' ? null : str);
    this.onChangeHandler(this.state.filter);

  }

}
