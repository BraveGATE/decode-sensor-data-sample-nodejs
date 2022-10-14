'use strict';

const { FloodSensorData } = require('../../index');

describe('valid sensor data', () => {
  const s = new FloodSensorData('AQEAYNx5RABgwEGh33lEAMi+QVM=');

  it('valid sensor data', () => {
    expect(s.waterPressure).toBeCloseTo(999.443359375);
    expect(s.waterTemperature).toBeCloseTo(24.046875);
    expect(s.airPressure).toBeCloseTo(999.4942016601562);
    expect(s.airTemperature).toBeCloseTo(23.84765625);
    expect(s.battery).toBe(83);
    expect(s.fwVersion).toEqual('1.1.0');
  });

  it('check toString', () => {
    expect(s.toString()).toEqual(
      'FwVersion: 1.1.0\n' +
        'WaterPressure: 999.443359375\n' +
        'WaterTemperature: 24.046875\n' +
        'AirPressure: 999.4942016601562\n' +
        'AirTemperature: 23.84765625\n' +
        'Battery: 83\n'
    );
  });
});

test('invalid sensor data', () => {
  expect(() => {
    new FloodSensorData('AQEAYNx5RABgwEGh33lEAM+QVM=');
  }).toThrow('invalid sensor data');
});
