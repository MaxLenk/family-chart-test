import React from "react";
import f3 from "./family-chart/index.js"; // npm i family-chart
import "./family-chart.css"; // create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree
import treeJsonData from '../src/json/family_tree.json'


export default class FamilyTree extends React.Component {
  cont = React.createRef();

  componentDidMount() {
    if (!this.cont.current) return;

    const store = f3.createStore({
        main_id: this.props.person_id ? this.props.person_id : "0",
        data: treeJsonData,
        node_separation: 250,
        level_separation: 110
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
        link_break: false,
        infoLink: true,
      });

    view.setCard(Card);
    store.setOnUpdate((props) => view.update(props || {}));
    store.update.tree({ initial: true });

  }

  
  render() {
    var styles = {
      options: {
        float: "left",
        width: "20%"
      },
      tree: {
        float: "left"
      }
    };
    
    return (
    <>
      <div style={styles.options}>
        <div>
          <br/>
          <input type="checkbox" id="fit_view" name="fit_view" defaultChecked />
          <label htmlFor="fit_view">Auto-resize Tree</label>
        </div>
      </div>
      <div style={styles.tree}>
        <br/>
        <div className="f3" id="FamilyChart" ref={this.cont}></div>
      </div>
    </>
    );
  }
}
