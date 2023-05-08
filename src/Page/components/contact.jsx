import { useState } from "react";
import emailjs from "emailjs-com";
import React from "react";
import { useNotify } from "react-admin";
import "../../Style/Contact.css";

const initialState = {
  name: "",
  email: "",
  message: "",
};
export const Contact = (props) => {
  const [{ name, email, message }, setState] = useState(initialState);
  const notify = useNotify();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  const clearState = () => setState({ ...initialState });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, message);
    alert("Send successfully!", { type: "success" });

    emailjs
      .sendForm(
        "service_32fsbp5",
        "template_ml3ygdg",
        e.target,
        "zgEUaSGmakp-N6JaL"
      )
      .then(
        (result) => {
          console.log(result.text);
          notify("Send successfully!", { type: "success" });
          clearState();
        },
        (error) => {
          notify("Cannot save!", { type: "error" });
          console.log(error.text);
        }
      );
  };
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Get In Touch</h2>
                <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form name="sentMessage" validate="true" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    required
                    onChange={handleChange}
                  />
                  <p className="help-block text-danger" />
                </div>
                <div id="success" />
                <button type="submit" className="btn btn-custom btn-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info">
            <div className="contact-item">
              <h3>Contact Info</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                <span>
                  <i className="fa fa-map-marker" /> Address
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                <span>
                  <i className="fa fa-phone" /> Phone
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                <span>
                  <i className="fa fa-envelope-o" /> Email
                </span>{" "}
                <a
                  className="emailLink"
                  href="mailto:phuoc.phamcse206@hcmut.edu.vn"
                >
                  {props.data ? props.data.email : "loading"}
                </a>
                <span className="break-line" />
                <a
                  className="emailLink"
                  href="mailto:hung.trinh_hungking@hcmut.edu.vn"
                >
                  hung.trinh_hungking@hcmut.edu.vn
                </a>
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"}>
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.twitter : "/"}>
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.youtube : "/"}>
                      <i className="fa fa-youtube" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p>
            &copy; 2023 StudyAll. Design by{" "}
            <a href="http://www.studyall.com" rel="nofollow">
              StudyAll
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
