/*
  $ deploy meteor deploy foggo_todo.meteor.com
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
    console.log('toggleHideCompleted')
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
      incompleteCount: Tasks.find({checked: {$ne: true}}).count()
      //tasks: Tasks.find({}).fetch()
    }
  },

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    var text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    // we are adding a task to the tasks collection by calling Tasks.insert().
    Tasks.insert({
      text: text,
      createdAt: new Date() // current time
    });
 
    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  

  // Loads items from the Tasks collection and puts them on this.data.tasks
  renderTasks() {
    return this.data.tasks.map((task) => {
      return <Task key={task._id} task={task} />;
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

          {/* onSubmit attribute that references a method on the component called handleSubmit. In React, this is how you listen to browser events, like the submit event on the form. The input element has a ref property which will let us easily access this element later.
           */}
          <form className="new-task" onSubmit={this.handleSubmit} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks" />
          </form>
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
});