// Define a collection to hold our tasks
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code is executed on the client only
  
  // configure the accounts UI to use usernames instead of email addresses:
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
 
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    ReactDOM.render(<App />, document.getElementById("render-target"));
  });
}