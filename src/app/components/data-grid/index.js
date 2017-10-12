import classnames from 'classnames';

import * as Helpers from '../../services/helpers';
import template from './template.html';

import SearchInput from '../search';
import Pagination from '../pagination';

class DataGrid {

  /**
   * DataGrid Component
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
    // we need to do this because the context of 'this' will be different when the method is called
    this.sortRows = this.sortRows.bind(this);

  }

  /**
   * Writes the entire component to the DOM
   */
  init() {

    const filteredData = Helpers.filterRows(this.state.rows, this.state.filter);
    const pages = Helpers.paginateRows(filteredData, 10);

    // add the Pagination component
    const pagination = new Pagination(
      this.rootElement.querySelector('.pagination-container'),
      filteredData,
      (eventData) => {
        this.state.pagination = eventData;
        this.update();
      }
    );

    // add the SearchInput component
    const search = new SearchInput(
      this.rootElement.querySelector('.search-container'),
      (eventData) => {

        // eventData is the value of the text input
        this.state.filter = eventData;

        // set new data for the Pagination component
        pagination.data = Helpers.filterRows(this.state.rows, eventData);
        pagination.update();

        this.update();

      }
    );

    this.createHeader(this.columns);
    this.createBody(pages[this.state.pagination.currentPage] || [], this.columns);
    pagination.create();
    search.create();

  }

  /**
   * Updates all sections of the component
   */
  update() {

    const { rows, filter, pagination } = this.state;
    const filteredData = Helpers.filterRows(rows, filter);
    const pages = Helpers.paginateRows(filteredData, 10);

    this.updateHeader();

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
   * @param {array} columns Array of objects { key, label }
   */
  createBody(rows = [], columns = []) {

    const tBody = this.rootElement.querySelector('table tbody');

    // remove all rows from the table body
    tBody.innerHTML = '';

    // add rows to the table body
    rows.forEach((row, i) => {

      const tr = tBody.insertRow(i);

      // add cells to the row
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

    let sortingKey = key; // this avoids lint warning
    let order = 'asc'; // default sorting
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
      // because sorting is in place, we have to copy the original array and set it the state
      // TODO - maybe use lodash for sorting, although it's not necessary
      this.state.rows = this.rows.map(item => item);

    }

    // save the sorting state
    this.state.sorting = {
      key: sortingKey,
      order
    };

    this.update();

  }

}

export default DataGrid;
