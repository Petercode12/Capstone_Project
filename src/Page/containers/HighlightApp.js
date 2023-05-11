import * as appActions from "../actions/appActions";

import Highlightable, { Node } from "highlightable";
import Tooltip from "rc-tooltip";
import React, { Component } from "react";
import { Map, List } from "immutable";
import { connect } from "react-redux";
import "../styles/HighlightApp.css";

class HighlightApp extends Component {
  constructor() {
    super();
    this.state = {
      color: "#ffff7b",
      color_list: {},
    };
  }
  onTextHighlighted(range) {
    let temp = range.start + "-" + range.end;
    if (
      JSON.stringify(this.state.color_list).includes(
        range.start + "-" + range.end
      ) === false
    ) {
      let color_list_val = { ...this.state.color_list };
      color_list_val[range.start + "-" + range.end] = this.state.color;
      this.setState({ color: this.state.color, color_list: color_list_val });
      // this.setState({color_list: {...this.state.color_list, temp: this.state.color}})
    }
    this.props.highlightRange(range);
    window.getSelection().removeAllRanges();
  }

  tooltipRenderer(
    lettersNode,
    range,
    rangeIndex,
    onMouseOverHighlightedWord,
    color
  ) {
    // this.state.color_list[range.start + "-" + range.end] = this.state.color;

    // if(JSON.stringify(this.state.color_list).includes(range.start + "-" + range.end)) {
    //     let temp = range.start + "-" + range.end
    //     // this.setState({color_list: {...this.state.color_list, temp: this.state.color}})
    // }
    // else {
    //     console.log(
    //         "True"
    //     );
    // }
    console.log(
      "Range: ",
      range,
      JSON.stringify(this.state.color_list).includes(
        range.start + "-" + range.end
      )
    );

    // this.state.color_list[range.start + "-" + range.end] = this.state.color;

    // this.setState({color_list: {...this.state.color_list, temp: this.state.color}})
    console.log("this color: ", this.state.color_list);

    return (
      <Tooltip
        key={`${range.data.id}-${rangeIndex}`}
        onVisibleChange={onMouseOverHighlightedWord.bind(this, range)}
        placement="top"
        overlay={
          <div>
            <span
              className="highlight-icon1 highlight-color yellow"
              onClick={() => {
                console.log("Set color yellow");
                let temp = range.start + "-" + range.end;
                let color_list_val = { ...this.state.color_list };
                color_list_val[range.start + "-" + range.end] = "#ffff7b";
                this.setState({ color: "#ffff7b", color_list: color_list_val });
              }}
            />
            <span
              className="highlight-icon1 highlight-color blue"
              onClick={() => {
                console.log("Set color blue");
                let color_list_val = { ...this.state.color_list };
                color_list_val[range.start + "-" + range.end] = "#abf7ff";
                this.setState({ color: "#abf7ff", color_list: color_list_val });
              }}
            />
            <span
              className="highlight-icon1 highlight-color pink"
              onClick={() => {
                console.log("Set color pink");
                let color_list_val = { ...this.state.color_list };
                color_list_val[range.start + "-" + range.end] = "#ffd1d9";
                this.setState({ color: "#ffd1d9", color_list: color_list_val });
              }}
            />
            <span
              className="highlight-icon1 highlight-color green"
              onClick={() => {
                console.log("Set color green");
                let color_list_val = { ...this.state.color_list };
                color_list_val[range.start + "-" + range.end] = "#ceffce";
                this.setState({ color: "#ceffce", color_list: color_list_val });
              }}
            />
            <span
              className="highlight-icon1 highlight-color red"
              onClick={() => {
                console.log("Set color red");
                let color_list_val = { ...this.state.color_list };
                color_list_val[range.start + "-" + range.end] = "#FF3333";
                this.setState({ color: "#FF3333", color_list: color_list_val });
              }}
            />
            <span
              className="fas fa-trash highlight-icon1 highlight-remove trashmovetop"
              onClick={this.resetHightlight.bind(this, range)}
            />
          </div>
        }
        defaultVisible={false}
        animation="zoom"
      >
        <span>{lettersNode}</span>
      </Tooltip>
    );
  }

  customRenderer(
    currentRenderedNodes,
    currentRenderedRange,
    currentRenderedIndex,
    onMouseOverHighlightedWord,
    color
  ) {
    return this.tooltipRenderer(
      currentRenderedNodes,
      currentRenderedRange,
      currentRenderedIndex,
      onMouseOverHighlightedWord,
      this.state.color
    );
  }

  resetHightlight(range) {
    this.props.removeHighlightRange(range);
  }
  render() {
    return (
      <div className="row center-xs">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <Highlightable
            ranges={this.props.ranges.get(this.props.id, new List()).toJS()}
            enabled={true}
            style={{ textAlign: "left" }}
            onTextHighlighted={this.onTextHighlighted.bind(this)}
            id={this.props.id}
            highlightStyle={(range) => {
              if (
                JSON.stringify(this.state.color_list).includes(
                  range.start + "-" + range.end
                )
              ) {
                return {
                  backgroundColor: this.state.color_list[
                    range.start + "-" + range.end
                  ],
                };
              }
              return {
                backgroundColor: this.state.color,
              };
            }}
            rangeRenderer={this.customRenderer.bind(this)}
            // text={
            //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae magna lacus. Sed rhoncus tortor eget venenatis faucibus. Vivamus quis nunc vel eros volutpat auctor. Suspendisse sit amet lorem tristique lectus hendrerit aliquet. Aliquam erat volutpat. Vivamus malesuada, neque at consectetur semper, nibh urna ullamcorper metus, in dapibus arcu massa feugiat erat. Nullam hendrerit malesuada dictum. Nullam mattis orci diam, eu accumsan est maximus quis. Cras mauris nibh, bibendum in pharetra vitae, porttitor at ante. Duis pharetra elit ante, ut feugiat nibh imperdiet eget. Aenean at leo consectetur, sodales sem sit amet, consectetur massa. Ut blandit erat et turpis vestibulum euismod. Cras vitae molestie libero, vel gravida risus. Curabitur dapibus risus eu justo maximus, efficitur blandit leo porta. Donec dignissim felis ac turpis pharetra lobortis. Sed quis vehicula nulla."
            // }
            text={this.props.questionText}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ranges: state.app.get("ranges", new Map()),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    highlightRange: (range) => dispatch(appActions.highlightRange(range)),
    removeHighlightRange: (range) =>
      dispatch(appActions.removeHighlightRange(range)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightApp);
