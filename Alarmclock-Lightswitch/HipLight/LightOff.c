#include <wiringPi.h>
#include <stdio.h>

#define LedPin 3

int main(void)
{
    if(wiringPiSetup() == -1){ //whin initialize wioring failed, print message to screen
        printf("setup wiringPi failed!");
        return 1;
    }
    pinMode(LedPin, OUTPUT);
    digitalWrite(LedPin, HIGH);
}