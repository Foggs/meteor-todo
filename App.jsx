// App component - represents the whole app
App = React.createClass({
  
  // This mixin makes the getMeteorData method work
  //  use data from a Meteor collection inside a React component
  mixins: [ReactMeteorData],

  // using the createdAt field added by our new code sort the TODO list to place newer items on top
  getMeteorData() {
    return {
      tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch()
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
          <h1>Todo List</h1>
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