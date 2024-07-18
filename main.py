from microdot import Microdot, send_file
from microdot.websocket import with_websocket
from microdot.sse import with_sse
from machine import Pin
import dht
import time
import json
import asyncio

app = Microdot()
led = Pin('LED', Pin.OUT)
temp_sensor = dht.DHT11(Pin(10))

async def read_DHT():
    try:
        #time.sleep(3)
        temp_sensor.measure()
        temp = temp_sensor.temperature()
        temp_F = temp * (9/5) + 32.0
        print(f"The temperature is: {temp_F:.2f} degrees F.")
        return (temp_F)
    except OSError as e:
        print(f"Failed to read sensor.")
        return("Error")

@app.route('/')
async def index(request):
    return send_file('static/index.html')

@app.route('static/<path:path>')
async def static(request, path):
    if '..' in path:
        # directory traversal is not allowed
        return 'Page not found', 404
    return send_file('static/' + path)

@app.route('api/<path:path>', methods=['GET', 'POST'])
def index(request, path):
    global led
    endpoint_list = ['toggleled','ledstatus']
    
    if  request.method == 'GET':
        if any(ep == path for ep in endpoint_list):
            if 'toggleled' in path:
                led.toggle()
            return_str = json.dumps({'ledStatus': led.value()})
            return return_str
        else:
            return 'Unknown endpoint. Please check documentation for a list of valid endpoints.', 404
        
@app.route('/hwstate')
@with_websocket
async def traffic(request, ws):
    global led
    
    while True:
        msg = await ws.receive()
        print(f"The value received from the client was: {msg}")
        if int(msg) == 1:
            led.on()
            await ws.send(msg)
        elif int(msg) == 0:
            led.off()
            await ws.send(msg)
        elif int(msg) == 2:
            temp = await read_DHT()
            await ws.send(str(f"{temp:.2f}"))

print('starting API loop...')
#read_DHT()
app.run(port=80, debug=True)