// App component - represents the whole app
App = React.createClass({
  
  // This mixin makes the getMeteorData method work
  //  use data from a Meteor collection inside a React component
  mixins: [ReactMeteorData],

  // { _id: 1, text: "Move Tasks collection to 'both' directory" },
  getMeteorData() {
    return {
      tasks: Tasks.find({}).fetch()
    }
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
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
});