const ADXL345 = require('adxl345-sensor');
const omx = require('omxdirector');


// The ADXL345 constructor options are optional.
//
// ADXL345.I2C_ADDRESS_ALT_GROUNDED() = 0x53
// ADXL345.I2C_ADDRESS_ALT_HIGH() = 0x1D
//
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : ADXL345.I2C_ADDRESS_ALT_GROUNDED() // defaults to 0x53
};

const adxl345 = new ADXL345(options);

// Read ADXL345 three-axis acceleration, repeat
//
const getAcceleration = () => {
  adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
    .then((acceleration) => {
      // console.log(`acceleration = ${JSON.stringify(acceleration, null, 2)}`);
      if(acceleration.z < 0) {
        console.log('**LOG Z**', acceleration.z);
        !omx.isPlaying() && omx.play('test.wav');
      } else {
        omx.stop();
      }
      setTimeout(getAcceleration, 1000);
    })
    .catch((err) => {
      console.log(`ADXL345 read error: ${err}`);
      setTimeout(getAcceleration, 2000);
    });
};

// Initialize and configure the ADXL345 accelerometer
//
adxl345.init()
  .then(() => adxl345.setMeasurementRange(ADXL345.RANGE_2_G()))
  .then(() => adxl345.setDataRate(ADXL345.DATARATE_100_HZ()))
  .then(() => adxl345.setOffsetX(0)) // measure for your particular device
  .then(() => adxl345.setOffsetY(0)) // measure for your particular device
  .then(() => adxl345.setOffsetZ(0)) // measure for your particular device
  .then(() => adxl345.getMeasurementRange())
  .then((range) => {
    console.log(`Measurement range: ${ADXL345.stringifyMeasurementRange(range)}`);
    return adxl345.getDataRate();
  })
  .then((rate) => {
    console.log(`Data rate: ${ADXL345.stringifyDataRate(rate)}`);
    return adxl345.getOffsets();
  })
  .then((offsets) => {
    console.log(`Offsets: ${JSON.stringify(offsets, null, 2)}`);
    console.log('ADXL345 initialization succeeded');
    getAcceleration();
  })
  .catch((err) => console.error(`ADXL345 initialization failed: ${err} `));
