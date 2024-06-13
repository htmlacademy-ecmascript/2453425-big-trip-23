import AbstractView from './view/abstract';

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

const render = (component, container, place = RenderPosition.BEFOREEND) => {
  container.insertAdjacentElement(place, component.element);
};

const replace = (newComponent, oldComponent) => {
  if (
    !(
      newComponent instanceof AbstractView &&
      oldComponent instanceof AbstractView
    )
  ) {
    throw new Error('Can replace only components');
  }

  const newElement = newComponent.element;
  const oldElement = oldComponent.element;
  const parent = oldElement.parentElement;

  if (!parent) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newElement, oldElement);
};

const remove = (component) => {
  if (!component) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only component');
  }

  component.element.remove();
  component.removeElement();
};

export { RenderPosition, createElement, render, replace, remove };
