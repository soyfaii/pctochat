<h1>
  <img src="public/favicon.ico" height="18"> pctochat
</h1>

yet another browser-based pictochat clone that works on lan

it’s not an exact 1:1 clone though; it was never intended to be one, so i took some creative liberties

## how

just download [the latest release](https://github.com/soyfaii/pctochat/releases)!!!

### close enough: welcome back, download play!!!

only one person has to download the program so that everyone in the same network can access it using their browser!!!

everyone on the internet can access it too if you forward the chosen port (2004 by default) on your router's configuration

## extra arguments

* `--server`, `-s`: runs headless, without opening the browser
* `--port PORT`, `-p PORT`: listen to a different port 

## build/run from script

the server code can be interpreted, it IS python at the end of the day, but you can compile it for better portability

either way, you will need to install the following dependencies:

* `flask`
* `pyinstaller` (only for building)
* `waitress`

then, either run `main.py` or use the corresponding `.spec` file for your system
