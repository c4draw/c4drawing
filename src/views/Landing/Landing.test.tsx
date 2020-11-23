import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Landing from '../Landing/Landing';

describe("Tests for Landing.tsx", () => {
  let wrapper: RenderResult | null;

  beforeEach(() => {
    wrapper = render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    wrapper = null;
  });

  it("should render", () => {
    expect(wrapper).not.toBeNull();
  });

  it("should check if is logged user", () => {
    expect(wrapper).not.toBeNull();
  });

  it("should show links-container for not logged users", () => {
    expect(wrapper).not.toBeNull();
  });
});
