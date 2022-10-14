'use strict';

class FloodSensorSetting {
  static _size = 166;
  /**
   * @param  {string} sensorSettingBase64
   */
  constructor(sensorSettingBase64) {
    const buf = Buffer.from(sensorSettingBase64, 'base64');
    if (FloodSensorSetting._size != buf.byteLength) {
      throw new Error('invalid sensor setting!');
    }
    this.cableLength = buf.readInt16LE(0);
    this.sendStartWaterlevel = buf.readFloatLE(2);
    this.sendInterval = buf.readInt32LE(6);
    this.aliveSetting = new AliveSetting(buf.subarray(10, 11));
    if (this.aliveSetting.name == 'Unknown') {
      throw new Error('invalid alive setting');
    }
    this.scheduleSetting = new ScheduleSetting(buf.subarray(11, 75), this.aliveSetting.name);
    this.reserve = buf.subarray(75, 158);
    const fwMajor = buf.readInt8(158);
    const fwMinor = buf.readInt8(159);
    const fwBuild = buf.readInt8(160);
    this.fwVersion = `${fwMajor}.${fwMinor}.${fwBuild}`;
    const hwMajor = buf.readInt8(161);
    const hwMinor = buf.readInt8(162);
    const hwBuild = buf.readInt8(163);
    this.hwVersion = `${hwMajor}.${hwMinor}.${hwBuild}`;
    this.battery = buf.readInt8(164);
    this.sysStatus = buf.subarray(165).toString('hex');
  }

  toString() {
    return (
      `CableLength: ${this.cableLength}\n` +
      `SendStartWaterlevel: ${this.sendStartWaterlevel}\n` +
      `SendInterval: ${this.sendInterval}\n` +
      `AliveSetting: ${this.aliveSetting.toString()}\n` +
      `${this.scheduleSetting.toString()}` +
      `FwVersion: ${this.fwVersion}\n` +
      `HwVersion: ${this.hwVersion}\n` +
      `Battery: ${this.battery}\n` +
      `SysStatus: ${this.sysStatus}\n`
    );
  }
}

const AliveType = {
  Monthly: [Buffer.from([0x00]), '日時スケジュール'],
  Interval: [Buffer.from([0x01]), 'インターバル'],
  Daily: [Buffer.from([0x02]), '毎日スケジュール'],
  Off: [Buffer.from([0x03]), 'OFF'],
  Unknown: [Buffer.from([0xff]), '不明'],
};

class AliveSetting {
  constructor(bytes) {
    const type =
      Object.entries(AliveType).find((x) => 0 === x[1][0].compare(bytes)) ||
      Object.entries(AliveType).slice(-1)[0];
    this.name = type[0];
    this.value = type[1][0];
    this.description = type[1][1];
  }

  toString() {
    return `name: ${this.name}, value: ${this.value.toString('hex')}, description: ${
      this.description
    }`;
  }
}

class ScheduleSetting {
  static _size = 64;
  static _bytesDataMap = {
    Interval: -1,
    Monthly: 3,
    Daily: 2,
  };
  /**
   * @param  {Buffer} bytes of ScheduleSetting
   * @param  {string} scheduleType('Interval' or 'Daily' or 'Monthly')
   */
  constructor(bytes, scheduleType) {
    this.dailySchedule = [];
    this.monthlySchedule = [];
    this.interval = 0;

    if (ScheduleSetting._size != bytes.byteLength) {
      throw new Error('invalid schedule setting!');
    }
    if (!Object.keys(ScheduleSetting._bytesDataMap).includes(scheduleType)) {
      throw new Error('invalid schedule type!');
    }
    this.scheduleType = scheduleType;
    if (scheduleType == 'Interval') {
      this.interval = bytes.readInt32LE(0);
      return;
    }
    const intervalBytes = ScheduleSetting._bytesDataMap[scheduleType];
    bytes = bytes.subarray(4);
    for (let i = 0; i < ScheduleSetting._size - 4; i += intervalBytes) {
      const scheduleBytes = bytes.subarray(i, i + intervalBytes);
      if (scheduleType == 'Monthly') {
        if (0 == Buffer.from([0xff, 0xff, 0xff]).compare(scheduleBytes)) continue;
        const day = scheduleBytes.readInt8(0);
        const tmpMin = scheduleBytes.readInt16LE(1);
        const hour = Math.floor(tmpMin / 60);
        const min = tmpMin % 60;
        this.monthlySchedule.push(new Date(2022, 0, day, hour, min));
      } else if (scheduleType == 'Daily') {
        if (0 == Buffer.from([0xff, 0xff]).compare(scheduleBytes)) continue;
        const tmpMin = scheduleBytes.readInt16LE(0);
        const hour = Math.floor(tmpMin / 60);
        const min = tmpMin % 60;
        this.dailySchedule.push(new Date(2022, 0, 1, hour, min));
      }
    }
  }

  toString() {
    if (this.scheduleType == 'Interval') {
      return `Interval: ${this.interval}\n`;
    } else {
      let ret = '';
      this.dailySchedule.forEach((ds) => (ret += `Schedule: ${ds.toLocaleTimeString()}\n`));
      this.monthlySchedule.forEach((ds) => (ret += `Schedule: ${ds.toLocaleTimeString()}\n`));
      return ret;
    }
  }
}

module.exports = FloodSensorSetting;
