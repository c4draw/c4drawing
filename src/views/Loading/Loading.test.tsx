import { render } from '@testing-library/react';
import React from 'react';

import Loading from './Loading';

describe("Tests for Loading.tsx", () => {
  let wrapper;
  it("should render", () => {
    wrapper = render(<Loading />);
    expect(wrapper).not.toBeNull();
  });

  it("should render", () => {
    wrapper = render(<Loading />);
    expect(wrapper).not.toBeNull();
  });

  it("should render", () => {
    wrapper = render(<Loading />);
    expect(wrapper).not.toBeNull();
  });
});
