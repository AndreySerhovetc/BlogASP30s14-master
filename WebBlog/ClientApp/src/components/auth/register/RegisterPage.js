import React, { Component } from "react";
import { Link } from 'react-router-dom';
import RegisterForm from "./RegisterForm";

class RegisterPage extends Component {
    callBack = (x) => {
        console.log('---callBack----',x);
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-4 offset-md-4">
                
                    <RegisterForm semen="Дятел" func={this.callBack} />

                    <div className="text-center">
                        Already have an account?
                        <Link to='login'> Login here</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterPage;