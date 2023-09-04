import React from 'react';
import {render} from 'react-native-testing-library'
import HomeScreenView from './screens/HomeScreenView.js';
import DetailScreenView from './screens/DetailScreenView.js';
import LoginScreenView from './screens/LoginScreenView.js';
import RegisterScreenView from './screens/RegisterScreenView.js';
import PlansScreenView from './screens/PlansScreenView.js';
import ScannerScreenView from './screens/ScannerScreenView.js';
import AdminScreenView from './screens/AdminScreenView.js';
import CreatePlanScreenView from './screens/CreatePlanScreenView.js';


describe("Our sample test", () => {
  it("5*5 should be 26", () => {
    expect(5 * 5).toBe(25);
  })
})


describe("<App/>", () => {
  it("Should match snapshot", () => {
    const snap = render(<App/>).toJSON();
    expect(snap).toMatchSnapShot();
  })
})