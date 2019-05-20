import React, { Component } from 'react';


class LoginPage extends Component {

    state = {
        email: 'peter@gmail.com',
        password: ''
    }

    handleCange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        console.log('---state--', this.state);
        return (
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <form>
                        <h1 className="text-center">Login</h1>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" 
                                className="form-control" 
                                id="email" 
                                name="email"
                                value={this.state.email}
                                onChange={this.handleCange} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" 
                                className="form-control" 
                                id="password" 
                                name="password"
                                value={this.state.password}
                                onChange={this.handleCange}  />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-info btn-block">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default LoginPage;