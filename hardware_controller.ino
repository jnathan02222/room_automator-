#include <Servo.h>

//Declare servos
Servo bulb_light_servo;
Servo lantern_servo_1;
Servo pump_servo;  

int pos = 0;    // variable to store the servo position

void setup() {
  bulb_light_servo.attach(10); 
  lantern_servo_1.attach(11); 
  pump_servo.attach(6); 
}

void loop() {
 
}
