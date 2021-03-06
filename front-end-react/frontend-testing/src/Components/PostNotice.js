import React, { Component } from "react";
import axios from "axios";
import config from "react-global-configuration";
import DateTimePicker from "react-datetime-picker";
import { Jumbotron } from "react-bootstrap";
import Header from "./Header";

class PostNotice extends Component {
  state = {
    username: "",
    type: "normal",
    placeholder: "",
    title: "",
    body: "",
    url: "",
    img_url: null,
    is_event: false,
    eventDateTime: new Date(),
    file: null,
    all_tags: [],
    tags: [],
    submitting: false,
    status: "failure",
    error: ""
  };

  componentDidMount() {
    const username = localStorage.getItem("username");
    const type = localStorage.getItem("type");

    if (username == null) {
      this.props.history.push(`/login`);
    } else if (type != "Official Source") {
      this.props.history.push(`/`);
    } else {
      this.setState({
        username: username,
        type: type,
        submitting: false
      });
    }

    axios
      .get(config.get("host_url") + config.get("routes.get_tags"))
      .then(res => {
        this.setState({ all_tags: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  postNotice = event => {
    event.preventDefault();
    this.setState({
      submitting: true
    });
    var data = this.state;
    const username = localStorage.getItem("username");
    if (data.tags.indexOf(username) == -1) {
      data.tags.push(username);
    }
    console.log("this is data");
    console.log(data);
    axios
      .post(config.get("host_url") + config.get("routes.create_notice"), data)
      .then(res => {
        this.setState({ submitting: false });
        console.log(res.data);
        const { status, message } = res.data;
        if (status == "success") {
          alert("Notice Submitted Successfully!");
          this.props.history.push(`/`);
        } else if (status == "failure") {
          this.setState({
            placeholder: message
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

  handleChange = event => {
    const target = event.target;
    const value = target.type == "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleChangeDate = date => {
    this.setState({
      eventDateTime: date
    });
  };

  handleTag = event => {
    event.preventDefault();
    const tag = event.target.textContent.slice(1);
    const pos = this.state.tags.indexOf(tag);

    if (pos == -1) {
      event.target.className = "badge badge-pill badge-secondary";
      this.setState((prevState, props) => {
        tags: prevState.tags.push(tag);
      });
    } else {
      event.target.className = "badge badge-pill badge-light";
      this.setState((prevState, props) => {
        tags: prevState.tags.splice(pos, 1);
      });
    }
  };

  onFileChange = event => {
    console.log(event.target.files[0]);
    this.setState({ file: event.target.files[0] });
    console.log(this.state.file);
  };

  onFormSubmit = event => {
    event.preventDefault();
    const formData = new FormData();
    console.log("in onFormSubmit");
    console.log(this.state.file);
    formData.append("noticeImage", this.state.file);
    const conf = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    console.log(formData.get("noticeImage"));
    const upload_url = config.get("host_url") + `/notice/upload`;
    console.log(upload_url);
    axios
      .post(upload_url, formData, conf)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const tag_list = this.state.all_tags.map((item, index) => (
      <button
        className={
          this.state.tags.indexOf(item) != -1
            ? "badge badge-pill badge-secondary"
            : "badge badge-pill badge-light"
        }
        key={index}
        onClick={this.handleTag}
      >
        #{item}
      </button>
    ));
    const spin = (
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      />
    );
    return (
      <div>
        <Header page="PostNotice" />
        <Jumbotron>
          <div className="container">
            <div className="row">
              <div className="col-sm-9 col-md-7  mx-auto">
                <div className="card card-postNotice">
                  <div className="card-body">
                    <h5 className="card-title text-center">Post Notice</h5>
                    <h6 className="text-danger text-center">
                      {this.state.placeholder}
                    </h6>
                    <form className="form-postNotice">
                      <div className="form-label-group">
                        <label for="inputEmail">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          placeholder="Title"
                          value={this.state.title}
                          onChange={this.handleChange}
                        />
                        <br />
                      </div>

                      <div className="form-label-group">
                        <label for="inputDescription">
                          Description
                          <br />
                        </label>
                        <textarea
                          class="form-control"
                          rows="5"
                          name="body"
                          placeholder="Text"
                          value={this.state.body}
                          onChange={this.handleChange}
                        />
                        <br />
                      </div>
                      <div className="form-label-group">
                        <label for="inputEmail">URL</label>
                        <input
                          type="text"
                          className="form-control"
                          name="url"
                          placeholder="URL"
                          value={this.state.url}
                          onChange={this.handleChange}
                        />
                        <br />
                      </div>
                      <div>
                        <form onSubmit={this.onFormSubmit}>
                          <input type="file" onChange={this.onFileChange} />
                          <button type="submit">Upload</button>
                        </form>
                      </div>
                      <div>
                        <label style={{ width: 100 }}>
                          Is an Event :
                          <input
                            type="checkbox"
                            name="is_event"
                            checked={this.state.is_event}
                            onChange={this.handleChange}
                          />
                        </label>
                        <br />
                        <label>Starts At:</label>
                        <DateTimePicker
                          value={this.state.eventDateTime}
                          onChange={this.handleChangeDate}
                          disabled={!this.state.is_event}
                        />
                      </div>
                      <label> Tags </label>
                      <div>{tag_list}</div>
                      <br />
                      <div>
                        <button
                          className="btn btn-lg btn-success btn-block"
                          type="submit"
                          disabled={this.state.submitting}
                          onClick={this.postNotice}
                        >
                          {this.state.logging_in ? spin : ""} &nbsp;
                          {this.state.submitting ? "Submitting.." : "Submit"}
                        </button>

                        <br />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Jumbotron>
      </div>
    );
  }
}
export default PostNotice;
