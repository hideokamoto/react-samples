var Root = React.createClass({
    getInitialState: function(){
      var url = "http://wp-kyoto.net/";
      return {
        url: url,
        apiUrl: url + "wp-json/"
      }
    },
    componentWillMount: function() {

    },
    render: function(){
      var url = this.state.url;
      var apiUrl = this.state.apiUrl;
      return (
        <div id="container">
          <header>
            <h1>WP-APIを表示させるアプリ</h1>
            <table>
              <tr>
                <th>只今のURL</th>
                <td>{url} , {apiUrl}</td>
              </tr>
              <tr>
                <th>ここにWordPressのURL</th>
                <td>
                  <form onSubmit={this.urlChangeSubmit}>
                    <input type="text" value={url} onChange={this.urlChange}/>
                    <button type="submit">URL変更</button>
                  </form>
                </td>
              </tr>
            </table>
          </header>
          <hr/>
          <Container url={apiUrl}/>
        </div>
      );
    },
    urlChange: function(event){
      this.setState({
        url: event.target.value
      });
    },
    urlChangeSubmit: function(event){
      event.preventDefault();
      this.setState({
        apiUrl: this.state.url + "wp-json/"
      })
    }
});

var Container = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getDefaultProps: function(){
      return {
        url: "http://wp-kyoto.net/"
      };
    },
    getInitialState: function() {
      var initialState = {
        search: '',
        num: 10,
        order: 'DESC',
        siteData: [],
        query: {
          search: '',
          num: 3,
          order: 'DESC'
        }
      }
      return initialState;
    },
    render: function() {
      var url = this.props.url + "/wp-json/"
      return (
        <div id="root">
          <Header data={this.state.siteData}>
          </Header>
          <div className="contentBox container">
            <h2>記事検索</h2>
            <form className="section" onSubmit={this.submitHandler}>
              <div className="row">
                <label className="col s6">
                  <span>検索キーワード</span>
                  <input type="text" name="search" valueLink={this.linkState('search')}/>
                </label>
                <label className="col s3">
                  <span>表示件数</span>
                  <input type="number" name="num" valueLink={this.linkState('num')} />
                </label>
                <label className="col s3">
                  <span>表示順序</span>
                  <select name="order" valueLink={this.linkState('order')}>
                    <option value="DESC">降順</option>
                    <option value="ASC">昇順</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="btn waves-effect waves-light">Search</button>
            </form>
          </div>
          <Main url={url} query={this.state.query}></Main>
          <Footer data={this.state.siteData}></Footer>
        </div>
      );
    },
    componentDidMount: function() {
      this.ajaxRequest(this.props);
    },
    submitHandler: function(event){
      event.preventDefault();
      this.setState({
        query: {
          search: this.state.search,
          num: this.state.num,
          order: this.state.order
        }
      });
    },
    ajaxRequest: function(prop){
      $.ajax({
        url: prop.url + "/wp-json/?_jsonp=?",
        dataType: 'jsonp',
        callback: 'callback',
        success: function(data){
          this.setState({
            siteData:data
          });
        }.bind(this),
        error: function(data){
          console.error(this.props.url, status, data.toString());
        }.bind(this)
      });
    },
});

var Header = React.createClass({
  render: function(){
    var data = this.props.data;
    return (
      <nav className="top-nav pink">
        <div className=" nav-wrapper container">
          <h1 href={data.URL} className="brand-logo">{data.name}</h1>
          <span>{data.description}</span>
        </div>
      </nav>
    );
  }
});

var Main = React.createClass({
  getDefaultProps: function(){
    return {
      url: "http://wp-kyoto.net/"
    };
  },
  getInitialState: function() {
    return {
      postData: []
    };
  },
  render: function(){
    var posts = this.state.postData.map(function(data){
      return (
        <Post data={data} />
      );
    });
    return (
      <main className="container contentBox">
        <h2>記事一覧</h2>
        <div className="row">
          {posts}
        </div>
      </main>
    );
  },
  componentDidMount: function() {
    this.ajaxRequest(this.props);
  },
  componentWillReceiveProps: function(query){
    this.ajaxRequest(query);
  },
  ajaxRequest: function(prop){
    var url = prop.url + "posts?";
    url += "filter[s]=" + prop.query.search;
    url += "&filter[posts_per_page]=" + prop.query.num;
    url += "&filter[order]=" + prop.query.order;
    url += "&_jsonp=?";
    $.ajax({
      url: url,
      dataType: 'jsonp',
      callback: 'callback',
      success: function(data){
        this.setState({postData:data});
      }.bind(this),
      error: function(data){
        console.error(this.props.url, status, data.toString());
      }.bind(this)
    });
  },
});

var Post = React.createClass({
  getDefaultProps: function(){
    return {
      initialCount: 0
    }
  },
  getInitialState: function(){
    return {
      postData: this.props.data,
      content:  '',
      contentStatus: 'show-excerpt'
    }
  },
  render: function(){
    var data = this.state.postData;
    var articleClass = this.state.contentStatus;
    articleClass += " col s12";
    return (
      <article id={data.ID} className={articleClass}>
       <div className="postList" onClick={this.togglePost}>
          <i className="small mdi-notification-sms-failed"></i>
          <div>
            <h2>{data.title}</h2>
            <p>投稿者：{data.author.name}</p>
          </div>
        </div>
        <Cont cont={this.state.content}></Cont>
      </article>
    );
  },
  componentWillReceiveProps: function(postData){
    this.setState({
      postData: postData.data,
      content : '',
    });
  },
  togglePost: function(data){
    if(this.state.contentStatus == 'show-excerpt'){
      var status  = 'show-content';
      var content = this.state.postData.content;
    } else {
      var status  = 'show-excerpt';
      var content = '';
    }
    this.setState({
      content: content,
      contentStatus: status
    });
  },
});

var Footer = React.createClass({
  render: function(){
    var data = this.props.data;
    //this.doubleAjax();
    return (
      <footer>
        Copyright 2015 <a href={data.URL}>{data.name}</a><br/>
      </footer>
    );
  },
  doubleAjax: function(){
    $.when(
      $.getJSON('http://www.aiship.jp/knowhow/wp-json/posts'),
      $.getJSON('http://wp-kyoto.net/wp-json/posts')
    )
    .done(function(data_a,data_b){
      console.log(data_a[0],data_b[0]);
    })
    .fail(function(data_a,data_b){
      console.log(false);
    });
  },
});

var converter = new Showdown.converter();
var Cont = React.createClass({
    render: function() {
        var rawMarkUp;
        if (this.props.cont){
          rawMarkUp = converter.makeHtml(this.props.cont.toString());
        } else {
          rawMarkUp = "";
        }
        return (
            <div dangerouslySetInnerHTML={{__html: rawMarkUp}} className="content"></div>
        );
    }
});

React.render(
  <Container url="http://wp-kyoto.net/"/>,
  document.body
);
