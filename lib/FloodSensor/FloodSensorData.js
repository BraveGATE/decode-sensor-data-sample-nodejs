'use strict';

class FloodSensorData {
  /**
   * @param  {string} sensorDataBase64
   */
  constructor(sensorDataBase64) {
    const buf = Buffer.from(sensorDataBase64, 'base64');
    if (buf.byteLength != 20) {
      throw new Error('invalid sensor data');
    }
    const major = buf.readInt8(0);
    const minor = buf.readInt8(1);
    const build = buf.readInt8(2);
    this.fwVersion = `${major}.${minor}.${build}`;
    this.waterPressure = buf.readFloatLE(3);
    this.waterTemperature = buf.readFloatLE(7);
    this.airPressure = buf.readFloatLE(11);
    this.airTemperature = buf.readFloatLE(15);
    this.battery = buf.readInt8(19);
  }

  toString() {
    return (
      `FwVersion: ${this.fwVersion}\n` +
      `WaterPressure: ${this.waterPressure}\n` +
      `WaterTemperature: ${this.waterTemperature}\n` +
      `AirPressure: ${this.airPressure}\n` +
      `AirTemperature: ${this.airTemperature}\n` +
      `Battery: ${this.battery}\n`
    );
  }
}

module.exports = FloodSensorData;
