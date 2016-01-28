/*
  $ deploy>> meteor deploy foggo_todo.meteor.com
  Deploying to foggo_todo.meteor.com.
  Now serving at http://foggo_todo.meteor.com
  You can set a password on your account or change your email address at: https://www.meteor.com/setPassword?xbueAyZEpS
 */

// App component - represents the whole app
App = React.createClass({
  
  // This mixin makes the getMeteorData method work
  //  use data from a Meteor collection inside a React component
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  
  getMeteorData() {
    let query = {};
 
    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      query = {checked: {$ne: true}};
    }

    return {
      // using the createdAt field added by our new code sort the TODO list to place newer items on top
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      // display a count of the tasks that haven't been checked off
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      //tasks: Tasks.find({}).fetch()
      currentUser: Meteor.user()
    }
  },

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    var text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("addTask", text);

    // we are adding a task to the tasks collection by calling Tasks.insert().
    /*
    Only display the new task input field to logged in users Show which user created each tasks To do this, we will add two new fields to the tasks collection:
      owner - the _id of the user that created the task.
      username - the username of the user that created the task. 
    We will save the username directly in the task object so that we don't have to look up the user every time we display the task.
     */
    Tasks.insert({
      text: text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username  // username of logged in user
    });
 
    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  // Loads items from the Tasks collection and puts them on this.data.tasks
  renderTasks() {
    // Get tasks from this.data.tasks
    return this.data.tasks.map((task) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return <Task
        key={task._id}
        task={task}
        showPrivateButton={showPrivateButton} />;
    });
  },
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.data.incompleteCount})</h1>
          {/*client-side data filtering feature to our app, so that users can check a box to only see incomplete tasks*/}
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />
 

          
          {/* onSubmit attribute that references a method on the component 
          called handleSubmit. In React, this is how you listen to browser 
          events, like the submit event on the form. 
          The input element has a ref property which will let us easily 
          access this element later.
          Add a conditional statement to only show the form when there is 
          a logged in user
           */}
          { this.data.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks" />
            </form> : ''
          }
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
});