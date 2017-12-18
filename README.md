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
```json
    {
      "accessory": "HeatmiserWifi",
      "ip_address": "your_netmonitor_ip",
      "pin": your_pin,
      "name": "Kitchen Thermostat",
      "room": "Kitchen"
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
