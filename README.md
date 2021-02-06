# homebridge-heatmiser
## Heatmiser Thermostats Homebridge plugin

This is an Accessory plugin for Nick Farina's Homebridge implementation (https://github.com/nfarina/homebridge)

99% based on homebridge-heatmiser from Thosirl (https://github.com/thosirl/homebridge-heatmiser).

Uses Thosirl implementation revisited as standalone homebridge plugin (not legacy) plus Async Lock extension (https://github.com/kaaninel/asynclock) to avoid timeout on concurent connections

Tested with Heatmiser Wifi accessory here, not with Netmonitor.

# Installing Plugin

Plugin is NodeJS module published through NPM

You can install this plugin the same way you installed Homebridge - as a global NPM module. For example:

    sudo npm install -g homebridge-heatmiser


Add to config.json under "accessories" array
* For Heatmiser WiFi thermostats

Options for "your_model" are: "DT", "DT-E", "PRT", "PRT-E", "PRTHW" (see https://github.com/carlossg/heatmiser-node/blob/master/lib/wifi.js#L40)

The mintemp & maxtemp options set the range on the thermostat faceplate. The target temperature step size is now 1 degree as required by Heatmiser

```json
    {
      "accessory": "HeatmiserWifi",
      "ip_address": "your_heatmiserwifi_ip",
      "pin": your_pin,
      "port": 8068,
      "model": "your_model",
      "mintemp": 10,
      "maxtemp": 30,
      "name": "Thermostat",
      "room": "Hall"
    }
```

* For Netmonitor
```json
    {
      "accessory": "HeatmiserNetmonitor",
      "ip_address": "your_netmonitor_ip",
      "pin": your_pin,
      "network_address": 1, // Network Address of the Stat you want to talk to
      "name": "Kitchen Thermostat",
      "room": "Kitchen"
    }
```
