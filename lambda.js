/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
  try {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    /**
     * Uncomment this if statement and populate with your skill's application ID to
     * prevent someone else from configuring a skill that sends requests to this function.
     */
    /*
     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
     context.fail("Invalid Application ID");
     }
     */

    if (event.session.new) {
      onSessionStarted({requestId: event.request.requestId}, event.session);
    }

    if (event.request.type === "LaunchRequest") {
      onLaunch(event.request,
          event.session,
          function callback(sessionAttributes, speechletResponse) {
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
          });
    } else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
          event.session,
          function callback(sessionAttributes, speechletResponse) {
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
          });
    } else if (event.request.type === "SessionEndedRequest") {
      onSessionEnded(event.request, event.session);
      context.succeed();
    }
  } catch (e) {
    context.fail("Exception: " + e);
  }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
  console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
      ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
  console.log("onLaunch requestId=" + launchRequest.requestId +
      ", sessionId=" + session.sessionId);

  // Dispatch to your skill's launch.
  getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
  console.log("onIntent requestId=" + intentRequest.requestId +
      ", sessionId=" + session.sessionId);

  var intent = intentRequest.intent,
      intentName = intentRequest.intent.name;

  // Dispatch to your skill's intent handlers
  if ("PickLanguage" === intentName) {
    setLangInSession(intent, session, callback);
  }
  if ("PickLesson" === intentName) {
    setLessonInSession(intent, session, callback);
  } else if ("SayLang" === intentName) {
    getLangFromSession(intent, session, callback);
  } else if ("HowAreYou" === intentName) {
    howAreYou(callback);
  } else if ("GoodMorning" === intentName) {
    goodMorning(callback);
  } else if ("AMAZON.HelpIntent" === intentName) {
    getWelcomeResponse(callback);
  } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
    handleSessionEndRequest(callback);
  } else {
    throw "Invalid intent";
  }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
  console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
      ", sessionId=" + session.sessionId);
  // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
  // If we wanted to initialize the session to have some attributes we could add those here.
  var sessionAttributes = {};
  var cardTitle = "Welcome";
  var speechOutput = "Welcome to Lingo Guru. Please select a language.";
  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.
  var repromptText = "Please select a language saying, " +
      "select Japanese for example.";
  var shouldEndSession = false;

  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// ------------- Japanese words -------------

function howAreYou(callback) {
  var sessionAttributes = {};
  var cardTitle = "Convo";
  var speechOutput = "Thank you for asking! I'm Well!";
  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.
  var repromptText = "What?";
  var shouldEndSession = false;

  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function goodMorning(callback) {
  var sessionAttributes = {};
  var cardTitle = "Convo";
  var speechOutput = "Good Morning!";
  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.
  var repromptText = "What?";
  var shouldEndSession = false;

  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}



function handleSessionEndRequest(callback) {
  var cardTitle = "Session Ended";
  var speechOutput = "Thank you for learning with Lingo Guru. Have a nice day!";
  // Setting this to true ends the session and exits the skill.
  var shouldEndSession = true;

  callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the language in the session and prepares the speech to reply to the user.
 */
function setLangInSession(intent, session, callback) {
  var cardTitle = intent.name;
  var langSlot = intent.slots.language;
  var repromptText = "";
  var sessionAttributes = {};
  var shouldEndSession = false;
  var speechOutput = "";

  if (langSlot) {
    var lang = langSlot.value;
    sessionAttributes = createLangAttributes(lang);
    speechOutput = "You have selected " + lang;
    repromptText = "You can set the languages by saying, select Japansese for example.";
  } else {
    speechOutput = "I'm not sure what language you want to study. Please try again";
    repromptText = "I'm not sure what language you want to study." +
        "You can set the languages by saying, start Japansese for example.";
  }

  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the lesson in the session and prepares the speech to reply to the user.
 */
function setLessonInSession(intent, session, callback) {
  var cardTitle = intent.name;
  var lessonSlot = intent.slots.lesson;
  var repromptText = "";
  var sessionAttributes = {};
  var shouldEndSession = false;
  var speechOutput = "";

  if (lessonSlot) {
    var lesson = lessonSlot.value;
    sessionAttributes = createLessonAttributes(lesson);
    speechOutput = "You are now in " + lang;
    repromptText = "You can choose a lesson by saying, start lesson one for example.";
  } else {
    speechOutput = "I'm not sure what lesson you want to start. Please try again";
    repromptText = "I'm not sure what lesson you want to start" +
        "You can choose a lesson by saying, start lesson one for example.";
  }

  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createLangAttributes(lang) {
  return {
    lang: lang
  };
}

function createLessonAttributes(lesson) {
  return {
    lesson: lesson
  };
}

function getLangFromSession(intent, session, callback) {
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
      buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
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
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}