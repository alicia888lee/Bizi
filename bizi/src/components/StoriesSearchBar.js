import React from 'react'

class StoriesSearchBar extends React.Component {
    
    constructor(props) {
      super(props);
      this.state={search: ""};
      this.searchChange = this.searchChange.bind(this);
    }
  
    searchChange(e){
      this.setState({search: e.target.value});
    }
  
  
    render(){
      return (
        <div style={{bottom: "50%"}}>
          <h1 id="stories-search">Read Their Stories.</h1>
          <input type="text" id="searchbar2" placeholder="&#xF002; Search by name, location, category..." value={this.state.search} onChange={this.searchChange}/>
        </div>
        
      );
    }
}

export default StoriesSearchBar