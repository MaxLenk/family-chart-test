import React from "react";
import f3 from "./src/index.js"; // npm i family-chart
import "./family-chart.css"; // create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree

export default class FamilyTree extends React.Component {
  cont = React.createRef();

  componentDidMount() {
    if (!this.cont.current) return;

    const store = f3.createStore({
        data: data(),
        node_separation: 250,
        level_separation: 150
      }),
      view = f3.d3AnimationView({
        store,
        cont: document.querySelector("#FamilyChart")
      }),
      Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: {
          w: 220,
          h: 70,
          text_x: 75,
          text_y: 15,
          img_w: 60,
          img_h: 60,
          img_x: 5,
          img_y: 5
        },
        card_display: [
          (d) => `${d.data["first name"] || ""} ${d.data["last name"] || ""}`,
          (function (d) { if (d.data["nee"]){
            return "nee " + d.data["nee"];
          }
          else {
            return "";
          }
          }),
          (d) => `${d.data["birthday"] || ""}`
        ],
        mini_tree: true,
        link_break: false
      });

    view.setCard(Card);
    store.setOnUpdate((props) => view.update(props || {}));
    store.update.tree({ initial: true });

    function data() {
      return require('./data.json');
    }
  }

  render() {
    return <div className="f3" id="FamilyChart" ref={this.cont}></div>;
  }
}
