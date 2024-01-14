#include <Servo.h>

//Declare servos
Servo bulb_light_servo; 
Servo lantern_servo_1; 
Servo lantern_servo_2; 
Servo pump_servo; 


String data = ""; 
bool bulb_light_on = false;
int pos = 0;
void setup() {
  bulb_light_servo.attach(10); 
  lantern_servo_1.attach(11); 
  lantern_servo_2.attach(5); 
  pump_servo.attach(6); 

  bulb_light_servo.write(0);
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void doTask(String str){
  int key = str.toInt();
  if(key == 0){
      if(bulb_light_on){
        for (pos = 0; pos <= 180; pos += 1) { 
          bulb_light_servo.write(pos);             
          delay(15);                     
        }
      }else{
        for (pos = 180; pos >= 0; pos -= 1) { 
          bulb_light_servo.write(pos);             
          delay(15);                      
        }
      }
      bulb_light_on = !bulb_light_on;
    
  }else if(key == 1){
      pump_servo.attach(6);
      for (pos = 0; pos <= 180; pos += 1) { 
      // in steps of 1 degree
      pump_servo.write(pos);             
      delay(15);                       
      }
      for (pos = 180; pos >= 0; pos -= 1) { 
        pump_servo.write(pos);              
        delay(15);                       
      }
      pump_servo.detach();
  }
 
}

void loop() {

  if (Serial.available() > 0) {
     data = Serial.readString();
     for(int i = 0; i < data.length(); i++){
      doTask(String(data[i]));
     }
     data = "";
  }
 
}
