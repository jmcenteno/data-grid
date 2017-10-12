import template from './template.html';

export default function ErrorMessage(callback = () => {}) {

  const container = document.createElement('div');

  container.innerHTML = template;
  container.querySelector('button').addEventListener('click', callback);

  return container.firstChild;

}
