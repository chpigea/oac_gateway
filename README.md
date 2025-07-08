# oac_gateway
Gateway for the OAC project

## Installation of dependencies
> npm install

## Configuration
The OAC_CONFIG_FOLDER env variable can change the location of the folder contatining the JSON files for the configuration in different mode:
- production
- development

The configurable parameters are:
- protocol: protocol to be used by the service: http or https (default is http))
- port: port where the service will listen (default is 4000)
- url_register: url of the service register (default is "http://localhost:4001/services")

## Start
> npm start
