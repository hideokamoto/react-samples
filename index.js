var Container = React.createClass({
  render: function(){
    return (
      <div id="container">
        Reactのサンプルアプリをこのディレクトリに公開していく予定。
      </div>
    );
  }
})

React.render(
  <Container/>,
  document.body
);
