import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import jwt from 'jsonwebtoken';
import { connect } from 'react-redux';
import { SET_CURRENT_USER } from '../../../actions/types';
class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            image: '',
            confirmPassword:'',
            isLoading: false,
            errors: {}
        }
        //this.hadnleChageFunc=this.hadnleChageFunc.bind(this);
    }

    onSubmitForm = (e) => {
        e.preventDefault();

        const { email,password, confirmPassword, image } = this.state;
        let errors = {};
        if (email === '') errors.email = 'Enter valid email';
        const isValid = Object.keys(errors).length === 0;
        if (isValid) {
            this.setState({ isLoading: true });
            axios.post('/api/account/register',
                {
                    email: email,
                    password,
                    confirmPassword,
                    image
                    

                }).then(
                    (resp) => {
                        console.log('-----OK-----', resp);
                        let token = resp.data; 
                        let user = jwt.decode(token);
                        localStorage.setItem('jwtToken', token);
                        this.props.dispatch({type: SET_CURRENT_USER, user});
                        console.log('---user----',user);
                    },
                    (badResp) => {
                        this.setState({errors: badResp.response.data, isLoading: false});
                        console.log('----Bad---', errors);
                    }
                );
        }
        else {
            this.setState({errors});
        }
        // setTimeout(()=>{
        //     console.log('---End---');
        //     this.setState({isLoading: false});
        // }, 2000);
        console.log('--Submit form--');
    }

    // hadnleChageFunc(e) {
    //     e.preventDefault();
    //     const {errors}= this.state;
    //     console.log('-----handleChange name-------',e.target.name);
    //     console.log('-----handleChange value-------',e.target.value);
    //     const {name, value}= e.target;
    // }
    handleChange = (e) => {
        this.props.func(12);
        const {errors}= this.state;
        // console.log('-----handleChange name-------',e.target.name);
        // console.log('-----handleChange value-------',e.target.value);
        const {name, value}= e.target;
        //this.setState({[name]: value});
        //   igor.name='ggg';
        //   igor.lora={[igor.name]: 12};
        if (!!errors[name]) {
            let clone_errors = Object.assign({}, errors);
            delete clone_errors[name];
            this.setState(
                {
                    [name]: value,
                    errors: clone_errors
                }
            )
        }
        else {
            this.setState(
                { [name]: value })
        }
    }
    handleChangeImage = (e) =>{
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const base64= reader.result;
            console.log('-------------',base64)
            this.setState({ image: base64});
        };
        reader.readAsDataURL(files[0]);
        
    }
    

    render() {
        console.log('-----Props Register Form----', this.props);
        console.log('-----State----', this.state);
        const { isLoading, errors } = this.state;
        const { email } = this.state;
        return (
            <form onSubmit={this.onSubmitForm}>
                <h1 className="text-center">Register</h1>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text"
                        className={classnames('form-control', {'is-invalid': !!errors.email})}
                        id="email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                    />
                    {!!errors.email ? 
                    <div className="invalid-feedback">
                        {errors.email}
                    </div> : ''}

                </div>

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input type="file"
                        className='form-control'
                        id="image"
                        name="image"
                        onChange = {this.handleChangeImage}

                    />
                    
                </div>
                <img src={this.state.image} width="300"/>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password"
                        className={classnames('form-control', {'is-invalid': !!errors.password})}
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    {!!errors.password ? 
                    <div className="invalid-feedback">
                        {errors.password}
                    </div> : ''}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password"
                        className={classnames('form-control', {'is-invalid': !!errors.confirmPassword})}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                    />
                    {!!errors.confirmPassword ? 
                    <div className="invalid-feedback">
                        {errors.confirmPassword}
                    </div> : ''}
                </div>
                <div className="form-group">
                    <button type="submit"
                        className="btn btn-info btn-block"
                        disabled={isLoading}>Register</button>
                </div>
            </form>
        );
    }
}


export default connect()(RegisterForm);
