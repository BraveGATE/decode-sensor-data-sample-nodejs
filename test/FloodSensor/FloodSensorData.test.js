'use stricts';

'use stricts';

const { FloodSensorData } = require('../../index');

test('valid sensor data', () => {
  const sensorData = new FloodSensorData('AQEAYNx5RABgwEGh33lEAMi+QVM=');
  expect(sensorData.airPressure).toBeCloseTo(999.4942016601562);
});
