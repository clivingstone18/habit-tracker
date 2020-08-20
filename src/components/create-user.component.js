import React, { Component } from "react";
import axios from "axios";

export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const user = { username: this.state.username };
    this.setState({
      username: "",
    });

    axios
      .post("http://localhost:5000/users/add", user)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label>Create new user</label>
        <input
          type="text"
          value={this.state.username}
          onChange={this.onChangeUsername}
        />
        <input type="submit" value="Create new user"></input>
      </form>
    );
  }
}
