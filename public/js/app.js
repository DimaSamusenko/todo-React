var App = App || {};

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
    this.getItems();
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

App.TodoList = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  render: function () {
    var items = this.state.data.map(function (item, index) {
      return (
        <App.TodoItem title={item.title}></App.TodoItem>
      );
    });
    return (
      <div class="list">
        {items}
      </div>
    );
  }
});

App.TodoItem = React.createClass({
  render: function () {
    return (
      <div>
        {this.props.title}
      </div>
    );
  }
});

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