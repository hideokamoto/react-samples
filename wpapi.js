var converter = new Showdown.converter();
var Cont = React.createClass({
    render: function() {
        var rawMarkUp = converter.makeHtml(this.props.cont.toString());
        return (
            <div dangerouslySetInnerHTML={{__html: rawMarkUp}}></div>
        );
    }
});

var Head = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'jsonp',
            callback: 'callback',
            success: function(data){
                this.setState({data:data});
            }.bind(this),
            error: function(data){
                condole.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <section>
             <h1>{this.state.data.name}</h1>
             <p>{this.state.data.description}</p>
            </section>
        );
    }
});
 
var Main = React.createClass({
    ajaxRequest: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'jsonp',
            callback: 'callback',
            success: function(data){
                this.setState({data:data});
            }.bind(this),
            error: function(data){
                condole.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getDefaultProps: function(){
        return {
            url: "http://wp-kyoto.net/wp-json/posts?_jsonp=?"
        };
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
      this.ajaxRequest();
    },
    componentWillReceiveProps: function(nextProps){
      console.log('OK');
      console.log(this.props.url);
      this.ajaxRequest();
    },
    toggle: function(event) {
      var excerpt = this.state.data[0].excerpt;
      this.state.data[0].excerpt = this.state.data[0].content;
      this.state.data[0].content = excerpt;
      this.setState({data: this.state.data});
    },
    addpost: function(event){
      this.setProps({url:"http://wp-kyoto.net/wp-json/posts?filter[posts_per_page]=2&_jsonp=?"});
    },
    render: function() {
        var node = this.state.data.map(function(data){
            return (
                <article id="{data.ID}" class="{data.type}">
                  <h1>{data.title}</h1>
                  <Cont cont={data.excerpt}></Cont>
                  <p>投稿者：{data.author.name}</p>
                </article>
            );
        });
        return (
            <div>
                <button onClick={this.toggle}>toggle</button>
                <button onClick={this.addpost}>addpost</button>
                {node}
            </div>
        );
    }
});
 
var Foot = React.createClass({
    propTypes: {
        url: React.PropTypes.string
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'jsonp',
            callback: 'callback',
            success: function(data){
                this.setState({data:data});
            }.bind(this),
            error: function(data){
                condole.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div>
             <p>2015 Copyright:{this.state.data.name}</p>
                  <div id="example"></div>
            </div>
        );
    }
});
 
React.render(
  <Head url="http://wp-kyoto.net/wp-json/?_jsonp=?"/>,
  document.getElementById('header')
);
React.render(
  <Main url="http://wp-kyoto.net/wp-json/posts?filter[posts_per_page]=1&_jsonp=?"/>,
  document.getElementById('json')
);
React.render(
  <Foot url="http://wp-kyoto.net/wp-json/?_jsonp=?"/>,
  document.getElementById('footer')
);

