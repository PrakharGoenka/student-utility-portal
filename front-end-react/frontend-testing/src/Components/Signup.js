import React, { Component, Fragment } from "react";
import axios from "axios";
import Header from "./Header";
import { Form, Jumbotron, Button, Container, Row, Col } from "react-bootstrap";

class Signup extends Component {
	state = {
		username: "",
		password: "",
		type: "normal",
		placeholder: "",
		submitting: false
	};

	componentDidMount() {
		localStorage.setItem(`username`, ``);
		localStorage.setItem(`type`, ``);
	}

	handleChange = event => {
		const target = event.target;
		const value =
			target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	};

	handleSubmit = event => {
		event.preventDefault();
		const data = this.state;

		this.setState({
			submitting: true
		});

		axios
			.post("https://damp-fjord-85414.herokuapp.com/signup", data)
			.then(res => {
				const { status, message } = res.data;
				if (status === "success") {
					this.setState({
						placeholder: message,
						submitting: false
					});
					const { type, username } = this.state;
					localStorage.setItem(`username`, username);
					localStorage.setItem(`type`, type);
					this.props.history.push(`/profile/${type}/${username}`);
				} else if (status === "failure") {
					this.setState({
						placeholder: message,
						submitting: false
					});
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({
					error: error,
					placeholder: error.message,
					submitting: false
				});
			});
	};

	handleLogin = () => {
		this.props.history.push(`/login`);
	};

	render() {
		return (
			<div className="bg-light">
				<Header page="Signup" />
				<div className="container">
					<div className="row">
						<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
							<div className="card card-signup my-5">
								<div className="card-body">
									<h5 className="card-title text-center">
										Sign Up
									</h5>
									<h6 className="text-danger text-center">
										{this.state.placeholder}
									</h6>
									<form className="form-signup">
										<div className="form-label-group">
											<label for="inputEmail">
												Email address
											</label>
											<input
												type="email"
												className="form-control"
												placeholder="Email address"
												name="username"
												value={this.state.username}
												onChange={this.handleChange}
											/>
											<br />
										</div>
										<div className="form-label-group">
											<label for="inputPassword">
												Password
											</label>
											<input
												type="password"
												className="form-control"
												placeholder="Password"
												name="password"
												value={this.state.password}
												onChange={this.handleChange}
											/>
											<br />
										</div>

										<div className="form-group">
											<label for="userType">
												User Type
											</label>
											<select
												className="form-control custom-select"
												value={this.state.type}
												onChange={this.handleChange}
												name="type"
											>
												<option value="normal">
													Student
												</option>
												<option value="official">
													Official Source
												</option>
											</select>
										</div>

										<div>
											<button
												className="btn btn-lg btn-success btn-block"
												type="submit"
												onClick={this.handleSubmit}
											>
												{this.state.submitting
													? "Submitting.."
													: "Sign Up"}
											</button>
										</div>
										<hr className="my-4" />
										<div className="col text-center">
											Already a member? &nbsp;&nbsp;
											<a href="/login"> Log In </a>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Signup;
