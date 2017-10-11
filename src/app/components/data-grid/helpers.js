/**
 * Creates an array where each item is an array of n items
 * @param {array} rows
 * @param {number} itemsPerPage
 * @return {array} e.g. [ [1,2,3], [4,5,6] ]
 */
export function paginateRows(rows = [], itemsPerPage = 10) {

  const pages = [];
  let set = [];

  rows.forEach((row, i) => {

    set.push(row);

    if ((i + 1) % itemsPerPage === 0 || (i + 1) >= rows.length) {
      pages.push(set);
      set = [];
    }

  });

  return pages;

}

/**
 * Filters array item based on given input
 * @param {array} rows
 * @param {string} query
 * @return {array}
 */
export function filterRows(rows, query) {

  if (!rows.length || !query) {
    return rows;
  }

  const regExp = new RegExp(escape(query.toString().toLowerCase()));

  const filteredData = rows.filter((item) => {

    // the current item won't be returned by default
    let inArray = false;

    // check if there is a match in at least one property
    Object.keys(rows[0]).forEach((key) => {
      if (item[key] && regExp.test(escape(item[key].toString().toLowerCase()))) {
        inArray = true;
      }
    });

    return inArray;

  });

  return filteredData;

}

/**
 * Sorts an array by a given property
 * @param {string} key Property by which the array will be sorted
 * @return {Function} Custom comparison function
 */
export function sortByKey(key) {

  return (a, b) => {

    const rowA = (a[key] || '').toLowerCase();
    const rowB = (b[key] || '').toLowerCase();

    let comparison = 0;

    if (rowA > rowB) {
      comparison = 1;
    } else if (rowA < rowB) {
      comparison = -1;
    }

    return comparison;

  };

}
