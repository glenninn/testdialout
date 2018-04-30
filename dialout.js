var auth = require("./auth");


var userId = "1442589";

console.log("------------------------------------------------------");
console.log("testdialout");
console.log("   Simple test application to cause BlueJeans to do a PSTN or SIP");
console.log("   call-out to a meeting participant");
console.log("------------------------------------------------------\n");

if (process.argv.length != 5) {
	console.log("\nUsage: node dialout.js  <numeric mtg id> <p:pstn or s:sip> <dial#>");
	console.log("  Generate pairing code and outdial from the specified BlueJeans meeting");
	console.log("Where:");
	console.log("   <numeric mtg id> : the BlueJeans Meeting to join");
	console.log("   s/p :     Join via outcall to PSTN or SIP" );
	console.log("   <dial#> : The PSTN 10-digit #, or a SIP uri");
	process.exit();
}

var numericMtgId = process.argv[2];
var isPSTN = (process.argv[3]=='p');
var dialTo = process.argv[4];


var getMtgAccessTokenRec =
{
  grant_type : "meeting_passcode",
  meetingNumericId : "",
  meetingPasscode : ""
};

var pairCodeRec = {
  endpointName : "call iphoasdfasne xx2",
  endpointType : "PSTN",
  userId : 0,
  languageCode : "en",
  capabilities : [
    "AUDIO"
  ]
};

var dialoutRecPSTN =
{
  connectionGuid : "",
  countryCode : 1,
  pairedParticipantGuid : "",
  phoneNumber : ""
};

var dialoutRecSIP =
{
  uri : ""
}


function makePSTNCall(pcResults){
	console.log("\n*******************************************");
	console.log(  "* Making PSTN outdial")
	console.log(  "*******************************************");

	dialoutRecPSTN.connectionGuid = pcResults.connectionGuid;
	dialoutRecPSTN.pairedParticipantGuid = pcResults.seamEndpointGuid;		
	dialoutRecPSTN.phoneNumber = dialTo;
	
	auth.post(apihost,makeOutdialPSTN,dialoutRecPSTN).then( (doResults)=>{
		console.log("\nSuccess! Kicked-off --PSTN-- outdial to: " + dialoutRecPSTN.phoneNumber);
		
	}, (doErrors) => {
		console.log("\n?Error:  unable to make dialout: " + JSON.stringify(doErrors,null,2) );
	});
}


function makeSIPCall(pcResults){
	console.log("\n*******************************************");
	console.log(  "* Making SIP outdial")
	console.log(  "*******************************************");

	//dialoutRecPSTN.connectionGuid = pcResults.connectionGuid;
	//dialoutRecPSTN.pairedParticipantGuid = pcResults.seamEndpointGuid;		
	dialoutRecSIP.uri = dialTo;
	
	auth.post(apihost,makeOutdialPSTN,dialoutRecSIP).then( (doResults)=>{
		console.log("\nSuccess! Kicked-off --SIP-- outdial to: " + dialoutRecSIP.uri);
		
	}, (doErrors) => {
		console.log("\n?Error:  unable to make dialout: " + JSON.stringify(doErrors,null,2) );
	});
}


function setAPIfields(){
	getPairingCodePSTN=getPairingCodePSTN.replace("{user_id}",userId);
	getPairingCodePSTN=getPairingCodePSTN.replace("{numeric_meeting_id}",numericMtgId);
	makeOutdialPSTN=makeOutdialPSTN.replace("{user_id}",userId);
	makeOutdialPSTN=makeOutdialPSTN.replace("{numeric_meeting_id}",numericMtgId);
}


var apihost = "api.bluejeans.com";
var getMtgAccessToken = "/oauth2/token";
var getPairingCodePSTN = "/v1/user/{user_id}/live_meetings/{numeric_meeting_id}/pairing_code/PSTN";
var makeOutdialPSTN = "/v1/user/{user_id}/live_meetings/{numeric_meeting_id}/dialout/pstn";

//setup for getting a mtg access token
getMtgAccessTokenRec.meetingNumericId = numericMtgId;

auth.post(apihost,getMtgAccessToken,getMtgAccessTokenRec).then( (results)=>{
	console.log("\nAcquired Meeting Access Token for mtg: " + numericMtgId + "\n token: " + results.access_token);
	
	auth.authorize(  results.access_token );   // encodeURI(results.access_token) );
	userId = results.scope.meeting.leaderId;
	console.log("---> Setting userId: " + userId);
	setAPIfields();
	
	auth.post(apihost,getPairingCodePSTN,pairCodeRec).then( (pcResults)=>{
		console.log("\nObtained pairing codes");
		console.log("  connectionGuid=   " + pcResults.connectionGuid);
		console.log("  seamEndpointGuid= " + pcResults.seamEndpointGuid);
		
		if(isPSTN){
			makePSTNCall(pcResults);
		} else {
			makeSIPCall(pcResults);
		}
		
	}, (pcErrors)=> {
		console.log("\n?Error:  unable to get pairing code: " + JSON.stringify(pcErrors,null,2) );
		
	});
	
}, (errors) => {
		console.log("\n?Error:  unable to get meeting access token: " + JSON.stringify(errors,null,2) );
	
});


