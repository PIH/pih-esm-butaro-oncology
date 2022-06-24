/**
 * This is the root test for this page. It simply checks that the page
 * renders. If the components of your page are highly interdependent,
 * (e.g., if the `Hello` component had state that communicated
 * information between `Greeter` and `PatientGetter`) then you might
 * want to do most of your testing here. If those components are
 * instead quite independent (as is the case in this example), then
 * it would make more sense to test those components independently.
 *
 * The key thing to remember, always, is: write tests that behave like
 * users. They should *look* for elements by their visual
 * characteristics, *interact* with them, and (mostly) *assert* based
 * on things that would be visually apparent to a user.
 *
 * To learn more about how we do testing, see the following resources:
 *   https://kentcdodds.com/blog/how-to-know-what-to-test
 *   https://kentcdodds.com/blog/testing-implementation-details
 *   https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
 *
 * Kent C. Dodds is the inventor of `@testing-library`:
 *   https://testing-library.com/docs/guiding-principles
 */
import React from "react";
import useSWR from "swr";
import { render, cleanup, screen } from "@testing-library/react";
import PatientStatusWidget from "./patient-status-widget";
import { mockProgramEnrollmentWithDiagnosisData } from "./resource.mocks";

jest.mock("swr");

const mockUseSWR = useSWR as jest.Mock;

function getMockSWRReturnValue(value) {
  return {
    data: { data: value },
    error: null,
    isValidating: false,
  };
}

const emptySWRResponse = getMockSWRReturnValue({ results: [] });

describe(`<PatientStatusWidget />`, () => {
  afterEach(cleanup);

  it(`renders without dying`, () => {
    mockUseSWR.mockReturnValue(emptySWRResponse);
    render(<PatientStatusWidget patientUuid="abc" />);
    screen.findByText(/status/i);
  });

  it(`renders a diagnosis`, async () => {
    mockUseSWR.mockImplementation((url) => {
      if (/programenrollment/.test(url)) {
        return getMockSWRReturnValue(mockProgramEnrollmentWithDiagnosisData);
      } else {
        return emptySWRResponse;
      }
    });
    render(<PatientStatusWidget patientUuid="abc" />);
    const diagnosisTitle = await screen.findByText("Diagnosis");
    const diagnosisDiv = diagnosisTitle.closest("div");
    expect(diagnosisDiv).toHaveTextContent(/Anal Carcinoma/);
  });
});
