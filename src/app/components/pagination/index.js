import classnames from 'classnames';

import * as Helpers from '../data-grid/helpers';
import template from './template.html';

class Pagination {

  constructor(element, data = [], onChangeHandler) {

    this.rootElement = element;
    this.data = data;
    this.onChangeHandler = onChangeHandler;

    this.state = {
      currentPage: 0,
      pages: Helpers.paginateRows(this.data, 10)
    };

    this.setCurrentPage = this.setCurrentPage.bind(this);

  }

  create() {

    const { pages } = this.state;
    const container = document.createElement('div');

    container.innerHTML = template;

    const select = container.querySelector('select');
    const firstBtn = container.querySelector('.btn.first');
    const prevBtn = container.querySelector('.btn.prev');
    const nextBtn = container.querySelector('.btn.next');
    const lastBtn = container.querySelector('.btn.last');

    select.innerHTML = '';

    // add options to the menu
    pages.forEach((item, i) => {

      // create on <option> element
      const option = document.createElement('option');

      // set option properties
      option.innerText = i + 1;
      option.setAttribute('value', i);

      select.appendChild(option);

    });

    // handle onchange event for page selection dropdown
    select.addEventListener('change', (e) => {
      this.setCurrentPage(Number.parseInt(e.target.value, 10));
    });
  
    // handle onclick event for first page button
    firstBtn.addEventListener('click', () => {
      this.setCurrentPage(0);
    });
  
    // handle onclick event for previous and next page buttons
    prevBtn.addEventListener('click', this.prevPage.bind(this));
    nextBtn.addEventListener('click', this.nextPage.bind(this));
  
    // handle onclick event for last page button
    lastBtn.addEventListener('click', () => {
      this.setCurrentPage(pages.length - 1);
    });

    this.rootElement.appendChild(container.firstChild);

  }

  update() {

    this.onChangeHandler(this.state);

  }

  /**
   * Sets the index of the paginated array as the current page
   * @param {number} page
   */
  setCurrentPage(page) {

    this.state.currentPage = page;
    this.rootElement.querySelector('select').selectedIndex = page;

    this.update();

  }

  /**
   * Go to the next page
   */
  nextPage() {

    const { currentPage, pages } = this.state;

    if (currentPage + 1 < pages.length) {
      this.setCurrentPage(currentPage + 1);
    }

  }

  /**
   * Go to the previous page
   */
  prevPage() {

    const { currentPage } = this.state;

    if (currentPage > 0) {
      this.setCurrentPage(currentPage - 1);
    }

  }

}

export default Pagination;
