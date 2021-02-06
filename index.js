'use strict';
var heatmiser = require("heatmiser");
var AsyncLock = require('async-lock');
const key = 'lock';
var Characteristic, Service;

module.exports = function (homebridge) {
    console.log("homebridge API version: " + homebridge.version);
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-heatmiser', 'HeatmiserWifi', HeatmiserWifi, false);
};

function HeatmiserWifi(log, config, api) {
    this.log = log;
    this.ip_address = config["ip_address"];
    this.pin = config["pin"];
    this.port = config["port"];
    this.model = config["model"];
    this.lock = new AsyncLock({ timeout: config["timeout"] || 5000 });}

HeatmiserWifi.prototype = {

    ctof: function (c) {
        return c * 1.8000 + 32.00;
    },

    ftoc: function (f) {
        return (f - 32.0) / 1.8;
    },

    getCurrentHeatingCoolingState: function (callback) {
        this.lock.acquire(key, function (done) {
            // async work
            this.log("getCurrentHeatingCoolingState");

            //Characteristic.CurrentHeatingCoolingState.OFF = 0;
            //Characteristic.CurrentHeatingCoolingState.HEAT = 1;
            //Characteristic.CurrentHeatingCoolingState.COOL = 2;
            var e = null;
            var hm = new heatmiser.Wifi(this.ip_address, this.pin, this.port, this.model);
            hm.on('error', (err) => {
                this.log('An error occurred! ' + err.message);
                e = err;
            });
            hm.read_device(function (data) {
                this.log('getCurrentHeatingCoolingState succeeded!');
                var m = data.dcb.heating_on;
                var mode;

                if (m == "cool") {
                    mode = Characteristic.CurrentHeatingCoolingState.COOL;
                } else if (m == true) {
                    mode = Characteristic.CurrentHeatingCoolingState.HEAT;
                } else {
                    mode = Characteristic.CurrentHeatingCoolingState.OFF;
                }
                done(e, mode);
            }.bind(this));
        }.bind(this), callback);
    },

    setTargetHeatingCoolingState: function (targetHeatingCoolingState, callback) {
        //Do something

        callback(null, "Auto");//No error
    },

    getTargetHeatingCoolingState: function (callback) {
        this.lock.acquire(key, function (done) {
            this.log("getTargetHeatingCoolingState");
            var e = null;
            var hm = new heatmiser.Wifi(this.ip_address, this.pin, this.port, this.model);
            hm.on('error', (err) => {
                this.log('An error occurred! ' + err.message);
                e = err;
            });
            hm.read_device(function (data) {
                this.log('getTargetHeatingCoolingState succeeded!');
                var m = data.dcb.heating_on;
                var mode;

                if (m == "cool") {
                    mode = Characteristic.CurrentHeatingCoolingState.COOL;
                } else if (m == true) {
                    mode = Characteristic.CurrentHeatingCoolingState.HEAT;
                } else {
                    mode = Characteristic.CurrentHeatingCoolingState.OFF;
                }

                done(e, mode);
            }.bind(this));
        }.bind(this), callback);
    },

    getCurrentTemperature: function (callback) {
        this.lock.acquire(key, function (done) {
            this.log("getCurrentTemperature");

            var e = null;
            var hm = new heatmiser.Wifi(this.ip_address, this.pin, this.port, this.model);
            hm.on('error', (err) => {
                this.log('An error occurred! ' + err.message);
                e = err;
            });
            hm.read_device(function (data) {
                this.log('getCurrentTemperature succeeded!');

                var c = data.dcb.built_in_air_temp;

                done(e, c);
            }.bind(this));

            //callback(null, 23.2);
        }.bind(this), callback);
    },

    getTargetTemperature: function (callback) {
        this.lock.acquire(key, function (done) {
            this.log("getTargetTemperature");

            var e = null;
            var hm = new heatmiser.Wifi(this.ip_address, this.pin, this.port, this.model);
            hm.on('error', (err) => {
                this.log('An error occurred! ' + err.message);
                e = err;
            });
            hm.read_device(function (data) {
                this.log('getTargetTemperature succeeded!');
                var target_temp = data.dcb.set_room_temp;

                done(e, target_temp);
            }.bind(this));
        }.bind(this), callback);
    },

    setTargetTemperature: function (targetTemperature, callback) {
        this.lock.acquire(key, function (done) {
            targetTemperature=Math.round(targetTemperature);
            this.log("setTargetTemperature " + targetTemperature);
            //this.log(targetTemperature);
            var dcb1 = {
                heating: {
                    target: targetTemperature
                }
            }

            var e = null;
            var hm = new heatmiser.Wifi(this.ip_address, this.pin, this.port, this.model);
            hm.on('error', (err) => {
                this.log('An error occurred! ' + err.message);
                e = err;
            });
            hm.write_device(dcb1);
            done(e);
        }.bind(this), callback);
    },

    getTemperatureDisplayUnits: function (callback) {
        this.lock.acquire(key, function (done) {
            this.log("getTemperatureDisplayUnits");

            var e = null;
            var hm = new heatmiser.Wifi(this.ip_address, this.pin, this.port, this.model);
            hm.on('error', (err) => {
                this.log('An error occurred! ' + err.message);
                e = err;
            });
            hm.read_device(function (data) {
                this.log('getTemperatureDisplayUnits succeeded!');
                var units = data.dcb.temp_format;
                done(e, units);
            }.bind(this));
        }.bind(this), callback);
    },

    setTemperatureDisplayUnits: function (displayUnits, callback) {
        this.log("setTemperatureDisplayUnits " + displayUnits);
        //this.log(displayUnits);
        callback(null);
    },

    getName: function (callback) {
        this.log("getName");
        callback(null, this.name);
    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {

        // you can OPTIONALLY create an information service if you wish to override
        // the default values for things like serial number, model, etc.
        var informationService = new Service.AccessoryInformation();

        informationService
          .setCharacteristic(Characteristic.Manufacturer, "Heatmiser")
          .setCharacteristic(Characteristic.Model, "Heatmiser Wifi") // Possible to get actual Model from DCB if required
          .setCharacteristic(Characteristic.SerialNumber, "HMHB-1");

        var thermostatService = new Service.Thermostat();

        thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).on('get', this.getCurrentHeatingCoolingState.bind(this));

        thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState).on('set', this.setTargetHeatingCoolingState.bind(this));
        thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState).on('get', this.getTargetHeatingCoolingState.bind(this));

        thermostatService.getCharacteristic(Characteristic.CurrentTemperature).on('get', this.getCurrentTemperature.bind(this));

        thermostatService.getCharacteristic(Characteristic.TargetTemperature).on('set', this.setTargetTemperature.bind(this));
        thermostatService.getCharacteristic(Characteristic.TargetTemperature).on('get', this.getTargetTemperature.bind(this));

        thermostatService.getCharacteristic(Characteristic.TemperatureDisplayUnits).on('set', this.setTemperatureDisplayUnits.bind(this));
        thermostatService.getCharacteristic(Characteristic.TemperatureDisplayUnits).on('get', this.getTemperatureDisplayUnits.bind(this));

        //thermostatService.getCharacteristic( new Characteristic.Name() ).on( 'get', this.getName.bind(this) );

        return [informationService, thermostatService];
    }
};
