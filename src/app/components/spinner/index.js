import template from './template.html';

/**
 * Spinner Component
 */
export default function Spinner() {

  const container = document.createElement('div');

  container.innerHTML = template;

  return container.firstChild;

}
