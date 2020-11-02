import React from 'react'
import Nav from './Nav'
import topImg from '../images/pexels-arnon-suksumran-996219.jpg';

class Header extends React.Component {

    constructor(props){
      super(props);
      this.state={search: ""};
      this.searchChange = this.searchChange.bind(this);
    }
  
    searchChange(e){
      this.setState({search: e.target.value});
    }
  
    render (){
      return (
      <div id="topImage">
        <Nav light={true} />
        <img src={topImg} id="topImg" />
        <h1 id="title" style={{color: 'white'}}>Stay Safe. Stay <span style={{color: '#385FDC'}}>Bizi</span>.</h1>
        <input type="text" id="searchbar" placeholder="&#xF002; Search businesses near you" value={this.state.search} onChange={this.searchChange}/>
      </div>
    );}
  }

export default Header;