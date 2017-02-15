#include <stdio.h>    // Used for printf() statements
#include <wiringPi.h> // Include WiringPi library!
#include <unistd.h>

#define LedPin 22

const int butPin = 17; // Active-low button - Broadcom pin 17, P1 pin 11

int main(void)
{
    // Setup stuff:
    wiringPiSetupGpio(); // Initialize wiringPi -- using Broadcom pin numbers
    pinMode(butPin, INPUT);      // Set button as INPUT
    pinMode(LedPin, OUTPUT);
    
    // pullUpDnControl(butPin,PUD_DOWN);

    int state = 0;

    while(1==1)
    {
        //printf("1");
        if (digitalRead(butPin) == 0) // Button is released if this returns 1
        {
            printf("button pressed");
            fflush(stdout);
            if(state == 0) {
                printf(" Light on \n");
                fflush(stdout);
                state = 1;
                digitalWrite(LedPin, LOW); //turn light on
            } else {
                printf(" Light off \n");
                fflush(stdout);
                state = 0;
                digitalWrite(LedPin, HIGH); //turn light off
            }
            while(digitalRead(butPin) == 0)
            {
            //printf("waiting");
            fflush(stdout);
            usleep(100000);
            }
        } else {
            usleep(100000);
        }
    }

    return 0;
}