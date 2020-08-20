import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default class CreateHabit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      duration: 0,
      startDate: new Date(),
      users: [],
    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/habits/" + this.props.match.params.id)
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            name: response.data.name,
            duration: response.data.duration,
            date: new Date(response.data.date),
          });
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/users/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map((user) => user.username),
            username: response.data[0].username,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeDuration(e) {
    this.setState({
      duration: e.target.value,
    });
  }

  onChangeDate(date) {
    this.setState({
      date: date,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const habit = {
      name: this.state.name,
      duration: this.state.duration,
      startDate: this.state.startDate,
    };
    console.log(habit);
    axios
      .post(
        "http://localhost:5000/habits/update" + this.props.match.params.id,
        habit
      )
      .then((res) => console.log(res.body))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.onSubmit}>
          <label>Username</label>
          <select
            ref="userInput"
            required
            className="form-control"
            value={this.state.username}
            onChange={this.onChangeUsername}
          >
            {this.state.users.map((user) => {
              return (
                <option key={user} value={user}>
                  {user}
                </option>
              );
            })}
          </select>
          <input
            type="text"
            value={this.state.name}
            onChange={this.onChangeName}
            placeholder="Name of habit"
          />
          <input
            type="text"
            value={this.state.duration}
            onChange={this.onChangeDuration}
            placeholder="Duration of habit in minutes"
          />
          <input type="Submit" value="Submit" />
        </form>
      </div>
    );
  }
}
