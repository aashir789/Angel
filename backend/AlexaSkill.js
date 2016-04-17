'use strict';

function AlexaSkill() {
    return this;
}


var FEEDBACK_NONE = "None";
var FEEDBACK_HELLO = "hello";



/**
 * Override any of the eventHandlers as needed
 */
AlexaSkill.prototype.eventHandlers = {
    /**
     * Called when the session starts.
     * Subclasses could have overriden this function to open any necessary resources.
     */
    onSessionStarted: function (sessionStartedRequest, session) {
	console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
		    ", sessionId=" + session.sessionId);
    },
    
    /**
     * Called when the user invokes the skill without specifying what they want.
     * The subclass must override this function and provide feedback to the user.
     */
    onLaunch: function (launchRequest, session, callback) {
	console.log("onLaunch requestId=" + launchRequest.requestId +
		    ", sessionId=" + session.sessionId);
	
	// Dispatch to your skill's launch.
	
	AlexaSkill.prototype.getWelcomeResponse(callback);
    },
    
    /**
     * Called when the user specifies an intent.
     */
    onIntent: function (intentRequest, session, callback) {

	if (session.attributes && session.attributes.feedback !== FEEDBACK_NONE  ){
	    AlexaSkill.prototype.feedbackHandlers(intentRequest, session, callback);
	}
	else{
	    AlexaSkill.prototype.simpleHandlers(intentRequest, session, callback);
	}
    },
    
    /**
     * Called when the user ends the session.
     * Subclasses could have overriden this function to close any open resources.
     */
    onSessionEnded: function (sessionEndedRequest, session) {
	console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
		    ", sessionId=" + session.sessionId);
	// Add cleanup logic here
    }
};

AlexaSkill.prototype.simpleHandlers = function(intentRequest, session, callback){
    
    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
    
    if ("PickLanguage" === intentName) {
	AlexaSkill.prototype.setLangInSession(intent, session, callback);
    } else if ("PickLesson" === intentName){
	AlexaSkill.prototype.setLessonInSession(intent, session, callback);
    } else if ("SayLang" === intentName) {
	AlexaSkill.prototype.getLangFromSession(intent, session, callback);
    } else if ("HowAreYou" === intentName) {
	AlexaSkill.prototype.howAreYou(callback);
    } else if ("GoodMorning" === intentName) {
	AlexaSkill.prototype.goodMorning(callback);
    } else if ( intentName === "bye" ){
	AlexaSkill.prototype.bye(callback);
    } else if ( intentName === "CustomAudio" ){
	AlexaSkill.prototype.CustomAudio(callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
	AlexaSkill.prototype.getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
	AlexaSkill.prototype.handleSessionEndRequest(callback);
    } else {
	throw "Invalid intent";
    }
};


AlexaSkill.prototype.feedbackHandlers = function(intentRequest, session, callback){
    
    console.log("onIntent requestId=" + intentRequest.requestId +
		", sessionId=" + session.sessionId);

    console.log("YAYAYAYAY in the feedback handler");


    
    
    var intent = intentRequest.intent,
	intentName = intentRequest.intent.name;
        intentVal = intentRequest.intent.slots.japaneseWord.value;
    
    var sessionAttributes = {};
    var cardTitle = "Feeback";
    var speechOutput = "Can you please repeat that ?";
    var repromptText = "Say ko ni chi va";
    var shouldEndSession = false;
    sessionAttributes = AlexaSkill.prototype.createFeedbackAttributes(FEEDBACK_HELLO);

    if (intentName === "feedback"){
        console.log("Intent name was feedback because you used is it.");
	console.log(intentRequest.intent.slots.japaneseWord);
	console.log(intentRequest.intent.slots.japaneseWord.value);
	if (intentVal === "ko ni chi wa"){
	    speechOutput = "Good job. You can now say hello in Japanese."
	    sessionAttributes  =  AlexaSkill.prototype.createFeedbackAttributes(FEEDBACK_NONE);
	    shouldEndSession = true;
	}
	
	callback(sessionAttributes,
		 this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
    
    else{
	console.log("intent wasnt feedback");
    }
    
};


AlexaSkill.prototype.getWelcomeResponse = function(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Lingo Guru. The best language learning app. Please select a language.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please select a language by saying, " +
	"select Japanese for example.";
    var shouldEndSession = false;
    
    sessionAttributes  =  AlexaSkill.prototype.createFeedbackAttributes(FEEDBACK_NONE);
    
    callback(sessionAttributes,
	     this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

AlexaSkill.prototype.howAreYou = function(callback) {
    var sessionAttributes = {};
    var cardTitle = "Convo";
    var speechOutput = "Im well, thank you for asking!";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "What?";
    var shouldEndSession = false;
    
    callback(sessionAttributes,
	     this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

AlexaSkill.prototype.goodMorning = function(callback) {
    var sessionAttributes = {};
    var cardTitle = "Convo";
    var speechOutput = "Good Morning!";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "What?";
    var shouldEndSession = false;
    
    callback(sessionAttributes,
	     this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};


AlexaSkill.prototype.bye = function(callback){
    
    var sessionAttributes = {};
    var cardTitle = "End LingoGuru";
    var speechOutput = "Thank you for learning with Lingo Guru. Have a great day.";
    var repromptText = "b'bye";
    var shouldEndSession = true;
    
    
    callback(sessionAttributes,
	     this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

AlexaSkill.prototype.CustomAudio = function(callback){
    
    var sessionAttributes = {};
    var cardTitle = "End LingoGuru";
    var speechOutput = "Now repeat after me. <audio src='https://s3-us-west-1.amazonaws.com/lingoguru/convertedHello.mp3' /> ";
    var repromptText = "b'bye";
    var shouldEndSession = false;
    sessionAttributes = AlexaSkill.prototype.createFeedbackAttributes(FEEDBACK_HELLO);
    
    callback(sessionAttributes,
	     this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};


AlexaSkill.prototype.setLangInSession = function(intent, session, callback) {
    var cardTitle = intent.name;
    var langSlot = intent.slots.language;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    
    if (langSlot) {
	var lang = langSlot.value;
	sessionAttributes = this.createLangAttributes(lang);
	speechOutput = "You have selected " + lang;
	repromptText = "You can set the languages by saying, select Japansese for example.";
    } else {
	speechOutput = "I'm not sure what language you want to study. Please try again";
	repromptText = "I'm not sure what language you want to study." +
            "You can set the languages by saying, start Japansese for example.";
    }
    
    callback(sessionAttributes,
	     this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

AlexaSkill.prototype.setLessonInSession = function(intent, session, callback) {
    var cardTitle = intent.name;
    var lessonSlot = intent.slots.lesson;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    
    if (lessonSlot) {
	var lesson = lessonSlot.value;
	sessionAttributes = this.createLessonAttributes(lesson);
	speechOutput = "You are now in " + lesson;
	repromptText = "You can choose a lesson by saying, start lesson one for example.";
    } else {
	speechOutput = "I'm not sure what lesson you want to start. Please try again";
	repromptText = "I'm not sure what lesson you want to start" +
            "You can choose a lesson by saying, start lesson one for example.";
    }
    
    callback(sessionAttributes,
      this.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};


AlexaSkill.prototype.handleSessionEndRequest = function(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for learning with Lingo Guru. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;
    
    callback({}, this.buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
};


AlexaSkill.prototype.createLangAttributes = function(lang) {
    return {
	lang: lang
    };
};

AlexaSkill.prototype.createLessonAttributes = function(lesson) {
    return {
	lesson: lesson
    };
};

AlexaSkill.prototype.createFeedbackAttributes = function(feedbackWord) {
    return {
	feedback: feedbackWord
    };
};


AlexaSkill.prototype.getLangFromSession = function(intent, session, callback) {
    var lang;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    
    if (session.attributes) {
	lang = session.attributes.lang;
    }
    
    if (lang) {
	speechOutput = "You are currently studying " + lang + ".";
    } else {
	speechOutput = "I'm not sure what language you are learning.";
    }
    
    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
	     this.buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
};

AlexaSkill.prototype.buildSpeechletResponse = function(title, output, repromptText, shouldEndSession) {
    return {
	outputSpeech: {
	    type: "SSML",
	    ssml: "<speak>" + output + "</speak>"
	},
	card: {
	    type: "Simple",
	    title: "SessionSpeechlet - " + title,
	    content: "SessionSpeechlet - " + output
	},
	reprompt: {
	    outputSpeech: {
		type: "SSML",
		ssml: "<speak>" + repromptText + "</speak>"
	    }
	},
	shouldEndSession: shouldEndSession
    };
};

AlexaSkill.prototype.buildResponse = function(sessionAttributes, speechletResponse) {
    return {
	version: "1.0",
	sessionAttributes: sessionAttributes,
	response: speechletResponse
    };
};

module.exports = AlexaSkill;
