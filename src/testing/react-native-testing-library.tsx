import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

interface RenderResult {
  toJSON(): string;
  getByText: (text: string | RegExp) => string;
  queryByText: (text: string | RegExp) => string | null;
  rerender: (ui: React.ReactElement) => void;
}

const containsText = (markup: string, text: string | RegExp) => {
  if (typeof text === 'string') {
    return markup.includes(text);
  }
  return text.test(markup);
};

export const render = (ui: React.ReactElement): RenderResult => {
  let markup = renderToStaticMarkup(ui);

  const getByText = (text: string | RegExp) => {
    if (!containsText(markup, text)) {
      throw new Error(`Unable to find text: ${text.toString()}`);
    }
    return markup;
  };

  const queryByText = (text: string | RegExp) => (containsText(markup, text) ? markup : null);

  const rerender = (newUi: React.ReactElement) => {
    markup = renderToStaticMarkup(newUi);
  };

  return {
    toJSON: () => markup,
    getByText,
    queryByText,
    rerender,
  };
};

export const screen = {
  getByText: (_text: string | RegExp) => {
    throw new Error('Use the render helper directly.');
  },
};
