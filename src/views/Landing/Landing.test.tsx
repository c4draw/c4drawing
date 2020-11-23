import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import cognito from 'services/cognito';

import Landing from '../Landing/Landing';

describe("Tests for Landing.tsx", () => {
  let wrapper: RenderResult | null;

  const renderWrapper = () =>
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    wrapper = null;
  });

  it("should render", () => {
    wrapper = renderWrapper();
    expect(wrapper).not.toBeNull();
  });

  it("should check if is logged user", () => {
    const cognitoSpy = jest
      .spyOn(cognito, "getLoggedUser")
      .mockReturnValue(null);

    renderWrapper();

    expect(cognitoSpy).toHaveBeenCalled();
  });

  it("should show links-container for not logged userds", () => {
    jest.spyOn(cognito, "getLoggedUser").mockReturnValue(null);

    const { getByTestId } = renderWrapper();
    const linksContainer = getByTestId("links-container");

    expect(linksContainer).not.toBeNull();
  });

  // beforeEach(() => {
  //   originFetch = (global as any).fetch;
  // });
  // afterEach(() => {
  //   (global as any).fetch = originFetch;
  // });
  // it('should pass', async () => {
  //   const fakeResponse = { title: 'example text' };
  //   const mRes = { json: jest.fn().mockResolvedValueOnce(fakeResponse) };
  //   const mockedFetch = jest.fn().mockResolvedValueOnce(mRes as any);
  //   (global as any).fetch = mockedFetch;
  //   const { getByTestId } = render(<List></List>);
  //   const div = await waitForElement(() => getByTestId('test'));
  //   expect(div).toHaveTextContent('example text');
  //   expect(mockedFetch).toBeCalledTimes(1);
  //   expect(mRes.json).toBeCalledTimes(1);
  // });
});
