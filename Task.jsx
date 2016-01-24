// Task component - represents a single todo item
Task = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: React.PropTypes.object.isRequired
  },

  /*
    The update function on a collection takes two arguments. The first is a selector that identifies a subset of the collection, and the second is an update parameter that specifies what should be done to the matched objects.In this case, the selector is just the _id of the relevant task. The update parameter uses $set to toggle the checked field, which will represent whether the task has been completed.
  */
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this.props.task._id, {
      $set: {checked: ! this.props.task.checked}
    });
  },

  /*
    The code below uses Tasks.remove to delete a task. The remove function takes one argument, a selector that determines which item to remove from the collection.
  */
  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? "checked" : "";
    
    return (
      <li>{taskClassName}
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>
 
        <input
          type="checkbox"
          readOnly={true}
          checked={this.props.task.checked}
          onClick={this.toggleChecked} />
 
        <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
});