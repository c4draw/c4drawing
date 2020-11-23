import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import cognito from 'services/cognito';

import Login from '../Login';

describe("Tests for Landing.tsx", () => {
  let wrapper: RenderResult | null;

  const renderWrapper = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    wrapper = null;
  });

  it("should render", () => {
    wrapper = renderWrapper();
  });

  it("should type 'admin@admin.com' on email field", () => {
    const { getByTestId } = renderWrapper();
    const mockedEmail = "admin@admin.com";
    const emailInput = getByTestId("email-input") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: mockedEmail } });
    expect(emailInput.value).toStrictEqual(mockedEmail);
  });

  it("should type 'Abc102030!@#' on password field", () => {
    const { getByTestId } = renderWrapper();
    const mockedPassword = "Abc102030!@#";
    const passwordInput = getByTestId("password-input") as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: mockedPassword } });
    expect(passwordInput.value).toStrictEqual(mockedPassword);
  });

  it("should fail trying to sign in with fictitious account", async () => {
    const cognitoAuthSpy = spyOn(cognito, "authenticate").and.callThrough();

    const { getByTestId, debug } = renderWrapper();

    const mockedEmail = "admin@admin.com";
    const emailInput = getByTestId("email-input") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: mockedEmail } });

    const mockedPassword = "Abc102030!@#";
    const passwordInput = getByTestId("password-input") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: mockedPassword } });

    expect(passwordInput.value).toStrictEqual(mockedPassword);

    const signInBtn = getByTestId("sign-in-btn") as HTMLButtonElement;

    fireEvent.click(signInBtn);

    expect(cognitoAuthSpy).toHaveBeenCalled();
  });
});
