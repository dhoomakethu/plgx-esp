# Build client for Ubunut Core machines.

## Requirments
* Ubuntu 18.04 and above
* Snapcraft is installed. Install with `sudo snap install snapcraft --classic`

## Build snap
* Makesure `certificate.crt` and `secrets.txt` files are availble under `x64` folder.
* cd to resources/linux directory and run `snapcraft --provider=host --destructive-mode`

## Install snap
* Copy snap to host and install with  `sudo snap install <snap-name> --devmode`

## More Info
* [Ubuntu Core](https://ubuntu.com/core)
* [Snaps](https://snapcraft.io/docs)
*