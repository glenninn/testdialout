

# Test Application to Generate OutDial from BlueJeans

This test application is written to demonstrate and test how to place an outdial from a BlueJeans meeting.  The outdial may be done to ***either*** a **PSTN** or a **SIP** endpoint.

## Getting Started
The application is written in NodeJS.  You will need to have installed `NodeJS` as well as its package manager application, `npm`.



1. Download the application from github.
2. Initialize the app environment by running `npm install`


# Running a session
This application requires mandatory command line options:

- user id :  This is the meeting scheduler's BlueJeans' UserID.
- numeric mtg id This is the meeting ID for the BlueJeans meeting where the outdialed participant will join
  - Optionally, a passcode can be specified by append a "period" and then the passcode
  - For example 4159908751.1234
- p / s : use the letter (lower case) p for PSTN outdial, or s for SIP callout
- dial# : the PSTN phone number (USA only) or the SIP uri


This is the CLI syntax to run a dialout session.  This example will place a PSTN phone call to 415-990-8751

		node dialout.js 146254 779192087.5598 p 4159908751






# Sample output from a PSTN command line session


    C:\testdialout> node dialout.js 146254 779192087.5598 p 4159908751
    ------------------------------------------------------
    testdialout
       Simple test application to cause BlueJeans to do a PSTN or SIP
       call-out to a meeting participant
    ------------------------------------------------------


​    
    Acquired Meeting Access Token for mtg: 779192087
     token: b509ebcaa17c415eab3eb3748f616471@z8
    ---> Setting userId: 1442589
    
    Obtained pairing codes
      connectionGuid=   connguid:4ee695fc-48b6-41cd-a356-78235449697e
      seamEndpointGuid= seamguid:f5185206-50f2-4e44-bf2f-b8a4ad4df6bf
    
    *******************************************
    * Making PSTN outdial
    *******************************************
    
    Success! Kicked-off --PSTN-- outdial to: 4159908751
    
    C:\testdialout>`