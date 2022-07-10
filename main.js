const console = require('console');
const fs = require('fs');
const { FloodSensorData } = require('./lib');
const { FloodSensorSetting } = require('./lib');

function getSensorDataFromWebhook(webhookPath) {
  const webhook = fs.readFileSync(webhookPath);
  const webhookJson = JSON.parse(webhook);
  return webhookJson.device.data.data;
}

// 冠水センサー水位データ
const sensorData = getSensorDataFromWebhook('./webhook/FloodSensor/sensor_data.json');
if (sensorData == undefined) {
  return;
}
const floodSensorData = new FloodSensorData(sensorData);
console.log(floodSensorData.toString());

// 冠水センサー設定データ
const sensorSettingData = getSensorDataFromWebhook('./webhook/FloodSensor/sensor_setting.json');
if (sensorSettingData == undefined) {
  return;
}
const floodSensorSetting = new FloodSensorSetting(sensorSettingData);
console.log(floodSensorSetting.toString());
