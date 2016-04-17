/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
  try {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    var newSkill = new AlexaSkill();

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
      newSkill.eventHandlers.onSessionStarted({requestId: event.request.requestId}, event.session);
    }

    if (event.request.type === "LaunchRequest") {
      newSkill.eventHandlers.onLaunch(event.request,
          event.session,
          function callback(sessionAttributes, speechletResponse) {
            context.succeed(newSkill.buildResponse(sessionAttributes, speechletResponse));
          });
    } else if (event.request.type === "IntentRequest") {
      newSkill.eventHandlers.onIntent(event.request,
          event.session,
          function callback(sessionAttributes, speechletResponse) {
            context.succeed(newSkill.buildResponse(sessionAttributes, speechletResponse));
          });
    } else if (event.request.type === "SessionEndedRequest") {
      newSkill.eventHandlers.onSessionEnded(event.request, event.session);
      context.succeed();
    }
  } catch (e) {
    // context.fail("Exception: " + e);
    newSkill.invalidIntent(function callback(sessionAttributes, speechletResponse) {
      context.succeed(newSkill.buildResponse(sessionAttributes, speechletResponse));
    });
  }
};
