#include <Servo.h>

//Declare servos
Servo bulb_light_servo; 
Servo lantern_servo_1; 
Servo lantern_servo_2; 
Servo pump_servo; 

String data = ""; 
int pos = 0;

void setup() {
  bulb_light_servo.attach(10); 
  lantern_servo_1.attach(11); 
  lantern_servo_2.attach(5); 
  pump_servo.attach(6); 
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void doTask(String str){
  int key = str.toInt();
  if(key == 0){
    digitalWrite(LED_BUILTIN, HIGH);
  }
}

void loop() {
  if (Serial.available() > 0) {
     data = Serial.readString();
     Serial.println(data);
     for(int i = 0; i < data.length(); i++){
      doTask(String(data[i]));
     }
     
  }

}
