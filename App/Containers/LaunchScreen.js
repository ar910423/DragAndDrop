import React, { Component } from 'react'
import { Text, View, LayoutAnimation } from "react-native"
import _ from "lodash";
import { DragContainer, Draggable, DropZone } from "react-native-drag-drop-and-swap"

let alphaData = [];
let first = "A", last = "E";
for (var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
  alphaData.push({ data: eval("String.fromCharCode(" + i + ")"), id: i });
}

export default class LaunchScreen extends Component {
  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.onHover = this.onHover.bind(this);

    this.state = {
      alphabets: alphaData,
      hoverData: {},
      dropData: {},
      hoverDataIndex: null,
      holds: [{}, {}],
    };
  }

  onDrop(data, index) {
    let alphabets = this.state.alphabets.map((item, i) => {
      if (item.id == data.id) {
        return this.state.hoverData;
      }
      if (item.id == this.state.hoverData.id) {
        return data;
      }
      return item;
    });
    this.setState({ alphabets });
  }

  onHold(e, index) {
    let data = this.state.alphabets || [];
    let alphabets = data.filter((item, i) => e.id !== item.id)

    if (this.state.holds[index] && this.state.holds[index].id) {
      alphabets.push(this.state.holds[index]);
    }

    let holds = this.state.holds;
    holds[index] = e;

    this.setState({ alphabets, holds })
  }

  onHover(hoverData, hoverDataIndex) {
    this.setState({ hoverData, hoverDataIndex });
  }

  render() {
    return (
      <DragContainer>
        <View style={{ flex: 1, justifyContent: "space-around", paddingTop:20 }}>
          <View style={{ flex: 0.2 }}>
            <View
              style={{
                flex: 1,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              <DropZone onDrop={(e) => this.onHold(e, 0)}>
                <MyDropZoneContent hold={this.state.holds[0]} />
              </DropZone>
              <DropZone onDrop={(e) => this.onHold(e, 1)}>
                <MyDropZoneContent hold={this.state.holds[1]} />
              </DropZone>
            </View>
          </View>

          <View style={{ flex: 0.7, justifyContent: "center" }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                flexDirection: "row",
                flexWrap: "wrap"
              }}
            >
              {this.state.alphabets.map((item, i) => (
                <Draggy
                  key={i}
                  alphabet={item}
                  onHover={this.onHover}
                  onDrop={this.onDrop}
                  index={i}
                />
              ))}
            </View>
          </View>
        </View>
      </DragContainer>
    );
  }
}

class DraggyInner extends Component {
  render() {
    if (this.props.dragOver && !this.props.ghost && !this.props.dragging) {
      LayoutAnimation.easeInEaseOut();
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: this.props.dragOver ? 40 : 36,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold"
            }}
          >
            {this.props.alphabet.data}
          </Text>
        </View>
      );
    }

    let shadows = {
      shadowColor: "black",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
    };

    return (
      <View
        style={[
          {
            height: 36,
            width: 108,
            backgroundColor: '#dddddd',
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 4,
            borderRadius: 4,
          },
          this.props.dragging ? shadows : null
        ]}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold"
          }}
        >
          {this.props.alphabet.data}
        </Text>
      </View>
    );
  }
}

class Draggy extends Component {
  render() {
    return (
      <Draggable data={this.props.alphabet} style={{ margin: 4 }}>
        <DropZone
          disabled
          onDrop={e => this.props.onDrop(e, this.props.index)}
          onEnter={e =>
            this.props.onHover(this.props.alphabet, this.props.index)
          }
        >
          <DraggyInner
            alphabet={this.props.alphabet}
            index={this.props.index}
          />
        </DropZone>
      </Draggable>
    );
  }
}

class MyDropZoneContent extends Component {
  componentWillReceiveProps({ dragOver }) {
    if (dragOver !== this.props.dragOver) LayoutAnimation.easeInEaseOut();
  }
  render() {
    return (
      <View
        style={{
          width: this.props.dragOver ? 116 : 108,
          height: this.props.dragOver ? 44 : 36,
          backgroundColor: "#dddddd",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        <View>
          <Text style={{fontWeight:"bold", fontSize: 14, fontWeight: 'bold'}}>{this.props.hold.data}</Text>
        </View>
      </View>
    );
  }
}
