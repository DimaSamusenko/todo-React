var App = App || {};

/**
 * Main Layout
 * @type {ClassicComponentClass<P>}
 */
App.Todo = React.createClass({
  getItems: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    var self = this;
    this.getItems();
    $(document).on('todo.delete', function (e, data) {
      self.setState({data: data});
    });
  },
  handleTodoSubmit: function (item) {
    var items = this.state.data;
    items.push(item);
    this.setState({data: items}, function() {
       $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: item,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  render: function () {
    return (
      <div>
        <App.TodoForm onTodoSubmit={this.handleTodoSubmit}></App.TodoForm>
        <App.TodoList data={this.state.data}></App.TodoList>
      </div>
    );
  }
});

/**
 * List of todos
 * @type {ClassicComponentClass<P>}
 */
App.TodoList = React.createClass({
  render: function () {
    var items = this.props.data.map(function (item, index) {
      return (
        <App.TodoItem id={item._id} title={item.title}></App.TodoItem>
      );
    });
    return (
      <div className="list">
        {items}
      </div>
    );
  }
});

/**
 * Todo item
 * @type {ClassicComponentClass<P>}
 */
App.TodoItem = React.createClass({
  clickHandler: function () {
    $.ajax({
      url: '/api/items' + '/' + this.props.id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        $(document).trigger('todo.delete', [data]);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
      <div>
        {this.props.title}
        <button type="button" onClick={this.clickHandler}>X</button>
      </div>
    );
  }
});

/**
 * Add todo
 * @type {ClassicComponentClass<P>}
 */
App.TodoForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var title = React.findDOMNode(this.refs.title).value.trim();
    if (!title) {
      return;
    }
    this.props.onTodoSubmit({title: title});
    React.findDOMNode(this.refs.title).value = '';
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Add TODO" ref="title" />
        <button type="submit">ADD</button>
      </form>
    );
  }
});



React.render(<App.Todo url='/api/items'></App.Todo>, document.getElementById('body'));