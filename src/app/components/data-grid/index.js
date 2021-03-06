import classnames from 'classnames';

import * as Helpers from './helpers';
import template from './template.html';

class DataGrid {

  /**
   *
   * @param {Element} element The DOM element where the table will be rendered
   * @param {object} config Object with columns and rows { columns, rows }
   */
  constructor(element, config = { columns: [], rows: [] }) {

    if (!(element instanceof Element)) {
      throw new Error('Invalid DOM element');
    }

    this.rootElement = element;
    this.columns = config.columns;
    this.rows = config.rows;

    // set initial state
    this.state = {
      rows: config.rows.map(item => item),
      sorting: {
        key: null,
        order: null
      },
      pagination: {
        pages: [],
        currentPage: 0,
      },
      filter: null
    };

    // add default HTML to the root element
    this.rootElement.innerHTML = template;

    // bind methods to this class
    this.sortRows = this.sortRows.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.setFilter = this.setFilter.bind(this);

  }

  /**
   * Writes the entire component to the DOM
   */
  init() {

    const filteredData = Helpers.filterRows(this.state.rows, this.state.filter);
    const pages = Helpers.paginateRows(filteredData, 10);

    this.createHeader(this.columns);
    this.createBody(pages[this.state.pagination.currentPage] || [], this.columns);
    this.createPagination(pages);
    this.createFilterControl();

  }

  /**
   * Updates all sections of the component
   */
  update() {

    const { rows, filter, pagination } = this.state;
    const filteredData = Helpers.filterRows(rows, filter);
    const pages = Helpers.paginateRows(filteredData, 10);

    this.updateHeader();
    this.updatePagination(pages);

    this.createBody(pages[pagination.currentPage], this.columns);

  }

  /**
   * Creates cells for the <thead> section of the table
   * @param {array} columns Array of objects { key, label, sortable }
   */
  createHeader(columns = []) {

    const tr = this.rootElement.querySelector('table thead tr');
    const { sorting } = this.state;

    tr.innerHTML = '';

    // iterate over each column and set the text and icon of its corresponding <th> element
    columns.forEach((item) => {

      const td = document.createElement('th');

      td.innerText = item.label;
      td.setAttribute('data-key', item.key);

      // check if current column can be sorted
      if (item.sortable || item.sortable === undefined) {

        // set classes on the <th> element
        td.className = classnames('sortable', {
          sorted: item.key === sorting.key
        });

        // add onclick event listener
        td.addEventListener('click', (e) => {
          this.sortRows(e.target.getAttribute('data-key'));
        });

        // create sorting icon
        const sortIcon = document.createElement('i');

        // set the icon class depending on how the column will be sorted
        sortIcon.className = classnames('icon', {
          'icon-sort': item.key !== sorting.key,
          'icon-sort-asc': item.key === sorting.key && sorting.order === 'asc',
          'icon-sort-desc': item.key === sorting.key && sorting.order === 'desc'
        });

        // add the icon the <th> element
        td.appendChild(sortIcon);

      }

      // add the <th> element to the row
      tr.appendChild(td);

    });

  }

  /**
   * Updates cells in the <thead> section
   */
  updateHeader() {

    const { sorting } = this.state;
    const tHeadRow = this.rootElement.querySelector('table thead tr');

    // iterate over each column
    this.columns.forEach((item, i) => {

      // check if current column can be sorted
      if (item.sortable || item.sortable === undefined) {

        tHeadRow.children[i].className = classnames('sortable', {
          sorted: item.key === sorting.key
        });

        // set the icon class depending on how the column will be sorted
        tHeadRow.children[i].querySelector('.icon').className = classnames('icon', {
          'icon-sort': item.key !== sorting.key,
          'icon-sort-asc': item.key === sorting.key && sorting.order === 'asc',
          'icon-sort-desc': item.key === sorting.key && sorting.order === 'desc'
        });

      }

    });

  }

  /**
   * Creates all table rows based on given input
   * @param {array} rows Array of objects
   */
  createBody(rows = [], columns = []) {

    const tBody = this.rootElement.querySelector('table tbody');

    // remove all rows from the table body
    tBody.innerHTML = '';

    // add rows to the table body
    rows.forEach((row, i) => {

      const tr = tBody.insertRow(i);

      columns.forEach((col, j) => {
        tr.insertCell(j).innerText = row[col.key];
      });

    });

  }

  /**
   * Sorts data by a given property
   * @param {key} key Property by which rows will be sorted
   */
  sortRows(key) {

    let sortingKey = key;
    let order = 'asc';
    const { sorting } = this.state;

    // determine how the row will be sorted
    if (sorting.key === sortingKey) {

      if (sorting.order === null) {
        order = 'asc';
      } else if (sorting.order === 'asc') {
        order = 'desc';
      } else if (sorting.order === 'desc') {
        order = null;
        sortingKey = null;
      }

    }

    // check if rows will be sorted
    if (order) {

      // sort rows by given property in ascending order first
      this.state.rows.sort(Helpers.sortByKey(sortingKey));

      // then, sort them in descending order if necessary
      if (order === 'desc') {
        this.state.rows = this.state.rows.reverse();
      }

    } else {

      // revert to default sorting
      this.state.rows = this.rows.map(item => item);

    }

    // save the sorting state
    this.state.sorting = {
      key: sortingKey,
      order
    };

    this.update();

  }

  /**
   * Creates options for page selection and event listeners for buttons
   * @param {array} pages Paginated array
   */
  createPagination(pages) {

    const container = this.rootElement.querySelector('.pagination');

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
      this.setCurrentPage(this.state.pagination.pages.length - 1);
    });

    // set pages in the state
    this.state.pagination.pages = pages;

  }

  /**
   * Updates options on the page selection dropdown
   * @param {array} pages Paginated array
   */
  updatePagination(pages) {

    const { pagination } = this.state;
    const select = this.rootElement.querySelector('.pagination select');

    // set pages and current page in the state
    this.state.pagination.pages = pages;
    this.state.pagination.currentPage = pages[pagination.currentPage] ? pagination.currentPage : 0;

    // remove all options
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

    // set the selected option
    select.selectedIndex = pages[pagination.currentPage] ? pagination.currentPage : 0;

  }

  /**
   * Sets the index of the paginated array as the current page
   * @param {number} page
   */
  setCurrentPage(page) {

    this.state.pagination.currentPage = page;
    this.update();

  }

  /**
   * Go to the next page
   */
  nextPage() {

    const { pagination } = this.state;

    if (pagination.currentPage + 1 < pagination.pages.length) {
      this.setCurrentPage(pagination.currentPage + 1);
    }

  }

  /**
   * Go to the previous page
   */
  prevPage() {

    const { pagination } = this.state;

    if (pagination.currentPage > 0) {
      this.setCurrentPage(pagination.currentPage - 1);
    }

  }

  /**
   * Set event listener for filter input
   */
  createFilterControl() {

    const container = this.rootElement.querySelector('.filter');
    const input = container.querySelector('input');

    input.value = this.state.filter || '';

    input.addEventListener('keyup', (e) => {
      this.setFilter(e.target.value);
    });

  }

  setFilter(str) {

    this.state.filter = (str === '' ? null : str);
    this.update();

  }

}

export default DataGrid;
