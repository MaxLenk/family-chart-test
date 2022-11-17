import React from 'react';
import f3 from "./family-chart/index.js"; // npm i family-chart
import "./family-chart.css"; // create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree
import treeJsonData from './json/family_tree.json'
import Select from 'react-select'

export default class FamilyTree extends React.Component {
  cont = React.createRef();

  constructor(props) {
    super(props)
    this.state ={
      store: null,
      view: null
    }
  }

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
          (d) => `${d.data["first name"] || "?"} ${d.data["last name"] || "?"}`,
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
    
    this.setState({ store: store, view: view });
  }

  updateTree = (selectedOptions) => {
    let store = {...this.state.store};
    store.state.main_id = selectedOptions.value;
    this.setState({ store: store });

    this.state.store.update.tree();
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

    const people_options = treeJsonData.map((person) => ({
      value: person['id'],
      label: `${(person["data"]["first name"] || "?") + " "}\
              ${person["data"]["nickname"] ? '"' + person["data"]["nickname"] + '" ' : ""}\
              ${person["data"]["last name"] || "?"}`
    }));

    return (
    <>
      <div style={styles.options}>
        <br/>
        <div>
          <input type="checkbox" id="fit_view" name="fit_view" defaultChecked />
          <label htmlFor="fit_view">Auto-resize Tree</label>
        </div>
        <br/>
        <div ref={this.cont}>
          <label>Find Person</label>
          <br/>
          <Select options={people_options} onChange={this.updateTree} />
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
