# Pin out

### DMX pin out

* G - `Ground/Common` - pin 1
* A - `Data+` - pin 3
* B - `Data-` - pin 2

<div><figure><img src=".gitbook/assets/image (1).png" alt=""><figcaption><p>XLR-3</p></figcaption></figure> <figure><img src=".gitbook/assets/image (2).png" alt=""><figcaption><p>XLR-5</p></figcaption></figure></div>

### Expansion pins

Can be used to extend the functionality of the Pico 2 by connecting a serial port, or I2C for example. Directly connected to the RP2040 GPIO 4 and 5, not protected. GND and 3.3V are also provided on these pins. Note the [errata](errata.md) for hardware revisions before v1.2.
