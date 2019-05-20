import React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './NavMenu.css';
import { SET_CURRENT_USER } from '../actions/types';

class NavMenu extends React.Component {
  constructor (props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  logout = (e) =>{
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    this.props.dispatch({type: SET_CURRENT_USER, user: {}});
  }
  render () {
    console.log('----props navMenu----', this.props);
    const { isAuthenticated }=this.props.auth;
    const logoutLink = (
      <li className="nav-item">
        <a href="#" className="text-dark nav-link" onClick={this.logout}>Logout</a>
      </li>
    );
    const loginLink = (
      <NavItem>
        <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
      </NavItem>
    );
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light >
          <Container>
            <NavbarBrand tag={Link} to="/">WebBlog</NavbarBrand>
            <NavbarToggler onClick={this.toggle} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem>
                {isAuthenticated ? logoutLink : loginLink}
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
const mapStateToProps = (stateRedux) => {
  return {
    auth: stateRedux.auth
  }
}

export default connect(mapStateToProps)(NavMenu);
