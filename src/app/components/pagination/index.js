import classnames from 'classnames';

import * as Helpers from '../data-grid/helpers';
import template from './template.html';

class Pagination {

  /**
   * Pagination Component
   * @param {Element} element DOM element where this component will be rendered
   * @param {array} data Array of data that will be paginated
   * @param {Function} onChangeHandler Callback function
   */
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

  /**
   * Add the component to the DOM and sets event listeners for buttons and dropdown
   */
  create() {

    const { pages } = this.state;
    const container = document.createElement('div');

    container.innerHTML = template;

    this.rootElement.appendChild(container.firstChild);

    const select = this.rootElement.querySelector('select');
    const firstBtn = this.rootElement.querySelector('.btn.first');
    const prevBtn = this.rootElement.querySelector('.btn.prev');
    const nextBtn = this.rootElement.querySelector('.btn.next');
    const lastBtn = this.rootElement.querySelector('.btn.last');

    this.setPageOptions(pages);

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
      this.setCurrentPage(this.state.pages.length - 1);
    });

  }

  /**
   * Updates the state, page options, and calls this.onChangeHandler callback
   */
  update() {

    // update the component state
    this.state.pages = Helpers.paginateRows(this.data, 10);
    this.state.currentPage = (
      this.state.currentPage <= this.state.pages.length - 1 ?
        this.state.currentPage :
        0
    );

    // create page options for dropdown
    this.setPageOptions(this.state.pages);

    // callback function
    this.onChangeHandler(this.state);

  }

  /**
   * Creates options for select dropdown based on the number of items in the array
   * @param {array} pages Paginated array
   */
  setPageOptions(pages) {

    const select = this.rootElement.querySelector('select');

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

    select.selectedIndex = this.state.currentPage;

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
