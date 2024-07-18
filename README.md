# MicroDot-Server

A sample WebServer project written in MicroPython and using the MicroDot framework to develop with. As written, the project is set up to work with a Raspberry Pi Pico W, but should be easily adaptable for use on other micro-controller boards that are compatible with MicroPython by adjusting the configured GPIO.

MicroDot can be found here: https://github.com/miguelgrinberg/microdot/tree/main

Documentation for MicroDot here: https://microdot.readthedocs.io/en/latest/intro.html

This sample project demonstrates various methods to host web content:
- Routes to host static content
- Routes to API endpoints, including appropriate error handling (404) responses for invalid endpoints
- A route for a WebSocket endpoint

The webserver can currently do the following:

- Monitor and control the status of the Pico W's on-board LED
- Monitor and send the current temperature of an attached DHT11 sensor that is attached to my development board.

As part of the static content, separate .js and .css files are also hosted on the Pico W - the files currently used by my project can be found in the Static folder of the project.

Many thanks to Miguel Grinberg for this great little project!
