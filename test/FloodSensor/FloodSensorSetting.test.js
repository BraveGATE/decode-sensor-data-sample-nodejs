'use strict';

const { FloodSensorSetting } = require('../../index');

describe('valid sensor setting', () => {
  describe('monthly', () => {
    const s = new FloodSensorSetting(
      'CgAAACBBLAEAAAD/////AQAAAgAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8BAAEBAAAAHQ=='
    );

    it('check value', () => {
      expect(s.cableLength).toBe(10);
      expect(s.sendStartWaterlevel).toBe(10);
      expect(s.sendInterval).toBe(300);
      expect(s.aliveSetting).toEqual({
        name: 'Monthly',
        value: Buffer.from([0x00]),
        description: '日時スケジュール',
      });
      expect(s.scheduleSetting).toEqual({
        scheduleType: 'Monthly',
        interval: 0,
        dailySchedule: [],
        monthlySchedule: [new Date(2022, 0, 1, 0, 0), new Date(2022, 0, 2, 0, 0)],
      });
      expect(s.reserve).toStrictEqual(Buffer.alloc(83, 0xff));
      expect(s.fwVersion).toBe('1.0.1');
      expect(s.hwVersion).toBe('1.0.0');
      expect(s.battery).toBe(0);
      expect(s.sysStatus).toBe('1d');
    });

    it('check toString', () => {
      expect(s.toString()).toEqual(
        'CableLength: 10\n' +
          'SendStartWaterlevel: 10\n' +
          'SendInterval: 300\n' +
          'AliveSetting: name: Monthly, value: 00, description: 日時スケジュール\n' +
          'Schedule: 12:00:00 AM\n' +
          'Schedule: 12:00:00 AM\n' +
          'FwVersion: 1.0.1\n' +
          'HwVersion: 1.0.0\n' +
          'Battery: 0\n' +
          'SysStatus: 1d\n'
      );
    });
  });

  describe('daily', () => {
    const s = new FloodSensorSetting(
      'CgAAACBBLAEAAAL/////hAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8BAAEBAAAAHQ=='
    );

    it('check value', () => {
      expect(s.cableLength).toBe(10);
      expect(s.sendStartWaterlevel).toBe(10);
      expect(s.sendInterval).toBe(300);
      expect(s.aliveSetting).toEqual({
        name: 'Daily',
        value: Buffer.from([0x02]),
        description: '毎日スケジュール',
      });
      expect(s.scheduleSetting).toEqual({
        interval: 0,
        scheduleType: 'Daily',
        dailySchedule: [new Date(2022, 0, 1, 15, 0)],
        monthlySchedule: [],
      });
      expect(s.reserve).toStrictEqual(Buffer.alloc(83, 0xff));
      expect(s.fwVersion).toBe('1.0.1');
      expect(s.hwVersion).toBe('1.0.0');
      expect(s.battery).toBe(0);
      expect(s.sysStatus).toBe('1d');
    });

    it('check toString', () => {
      expect(s.toString()).toEqual(
        'CableLength: 10\n' +
          'SendStartWaterlevel: 10\n' +
          'SendInterval: 300\n' +
          'AliveSetting: name: Daily, value: 02, description: 毎日スケジュール\n' +
          'Schedule: 3:00:00 PM\n' +
          'FwVersion: 1.0.1\n' +
          'HwVersion: 1.0.0\n' +
          'Battery: 0\n' +
          'SysStatus: 1d\n'
      );
    });
  });

  describe('interval', () => {
    const s = new FloodSensorSetting(
      'CgAAACBBLAEAAAEsAQAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8BAAEBAAAAHQ=='
    );

    it('valid sensor setting interval', () => {
      expect(s.cableLength).toBe(10);
      expect(s.sendStartWaterlevel).toBe(10);
      expect(s.sendInterval).toBe(300);
      expect(s.aliveSetting).toEqual({
        name: 'Interval',
        value: Buffer.from([0x01]),
        description: 'インターバル',
      });
      expect(s.scheduleSetting).toEqual({
        interval: 300,
        scheduleType: 'Interval',
        dailySchedule: [],
        monthlySchedule: [],
      });
      expect(s.reserve).toStrictEqual(Buffer.alloc(83, 0xff));
      expect(s.fwVersion).toBe('1.0.1');
      expect(s.hwVersion).toBe('1.0.0');
      expect(s.battery).toBe(0);
      expect(s.sysStatus).toBe('1d');
    });

    it('check toString', () => {
      expect(s.toString()).toEqual(
        'CableLength: 10\n' +
          'SendStartWaterlevel: 10\n' +
          'SendInterval: 300\n' +
          'AliveSetting: name: Interval, value: 01, description: インターバル\n' +
          'Interval: 300\n' +
          'FwVersion: 1.0.1\n' +
          'HwVersion: 1.0.0\n' +
          'Battery: 0\n' +
          'SysStatus: 1d\n'
      );
    });
  });
});

describe('invalid sensor setting', () => {
  it('invalid byte size', () => {
    expect(() => {
      new FloodSensorSetting(
        'CgAAACBBLAEAAAL/////hAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8BAAQ=='
      );
    }).toThrow('invalid sensor setting');
  });

  it('invalid aliveSetting', () => {
    expect(() => {
      new FloodSensorSetting(
        'CgAAACBBLAEAAAT/////hAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8BAAEBAAAAHQ=='
      );
    }).toThrow('invalid alive setting');
  });
});

describe('schedule setting test', () => {
  const ScheduleSetting = FloodSensorSetting.__get__('ScheduleSetting');
  it('invalid scheduleSetting size', () => {
    expect(() => {
      new ScheduleSetting(Buffer.alloc(83, 0xff), 'Monthly');
    }).toThrow('invalid schedule setting');
  });

  it('invalid scheduleSetting type', () => {
    expect(() => {
      new ScheduleSetting(Buffer.alloc(64, 0xff), 'Unknown');
    }).toThrow('invalid schedule type');
  });
});
