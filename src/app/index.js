import 'babel-polyfill';
import '../scss/styles.scss';

import DataGrid from './components/data-grid';
import Spinner from './components/spinner';
import ErrorMessage from './components/error-message';
import Books from './services/books';

export default function init() {

  const rootElement = document.getElementById('root');

  rootElement.innerHTML = '';
  rootElement.appendChild(Spinner());

  Books.get()
    .then((data) => {

      // set table columns and rows
      const config = {
        columns: [
          { key: 'title', label: 'Title' },
          { key: 'author', label: 'Author' },
          { key: 'year', label: 'Year' },
          { key: 'isbn', label: 'ISBN' }
        ],
        rows: data
      };

      // create an instance of the DataGrid object
      // pass the DOM element where the table will be rendered
      // pass a configuration object with the columns and rows
      const grid = new DataGrid(
        document.getElementById('root'),
        config
      );

      // add the data grid to the DOM
      grid.init();

    })
    .catch((error) => {

      // display a friendly error message
      rootElement.innerHTML = '';
      rootElement.appendChild(ErrorMessage(init));

      // display the actual error message in the console
      throw new Error(error);

    });

}

window.addEventListener('load', init);
