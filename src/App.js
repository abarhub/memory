import logo from './logo.svg';
import './App.css';
import React from "react";

// var elems= ["a","b","c"]
//
// let nb=4;
//
// let tab=[];
// let tabVisible=[];
// for (let i=0;i<nb;i++){
//   let row=[];
//   let row2=[];
//   tab.push(row);
//   tabVisible.push(row2);
//   for(let j=0;j<nb;j++){
//     row.push("A");
//     row2.push(false);
//   }
// }

// function coche(indexRow,indexColumn) {
//   if(indexRow>=0&&indexColumn>=0) {
//     console.info('coche',indexRow,indexColumn);
//     tabVisible[indexRow, indexColumn] = true;
//   }
// }

class CaseAffichage extends React.Component {

    constructor(props) {
        super(props);
    }

    coche() {
        const indexRow = this.props.indexRow;
        const indexColumn = this.props.indexColumn;
        const click = this.props.click;
        console.info('CaseAffichage.coche prop', this.props);
        if (indexRow >= 0 && indexColumn >= 0 && click) {
            console.info('CaseAffichage.coche', indexRow, indexColumn);
            click(indexRow, indexColumn);
        }
    }

    render() {
        const indexRow = this.props.indexRow;
        const indexColumn = this.props.indexColumn;
        const elem = this.props.elem;
        const visible = this.props.visible;
        if (visible) {
            return <td>{elem}-{indexRow}-{indexColumn}</td>
        } else {
            return <td onClick={this.coche.bind(this)}>*-{indexRow}-{indexColumn}</td>
        }
    }
}

class GrilleAffiche extends React.Component {

    constructor(props) {
        super(props);
        const nb = props.nb;
        const tab = [];
        const tabVisible = [];
        for (let i = 0; i < nb; i++) {
            let row = [];
            let row2 = [];
            tab.push(row);
            tabVisible.push(row2);
            for (let j = 0; j < nb; j++) {
                row.push("A");
                row2.push(false);
            }
        }
        this.state = {tab: tab, tabVisible: tabVisible, nb: nb};
        this.cocheCase = this.cocheCase.bind(this);
    }

    cocheCase = (indexRow, indexColumn) => {
        console.info('GrilleAffiche.cocheCase', indexRow, indexColumn, this.state.tabVisible);
        if (indexRow >= 0 && indexColumn >= 0 && this && this.state) {
            console.info('coche', indexRow, indexColumn);
            const tab = [];
            const nb = this.state.nb;
            for (let i = 0; i < nb; i++) {
                let row = [];
                tab.push(row);
                for (let j = 0; j < nb; j++) {
                    if (i == indexRow && j == indexColumn) {
                        row.push(true);
                    } else {
                        row.push(this.state.tabVisible[indexRow][indexColumn]);
                    }
                }
            }
            console.info('GrilleAffiche.cocheCase fin', indexRow, indexColumn, tab);
            this.setState({tabVisible: tab});
        }
    }


    render() {

        let m = this;
        console.log('click render', m.props, this.props, this.state);

        return <table border="1">
            <tbody>
            {
                this.state.tab.map(function (row, indexRow) {
                    return <tr>
                        {
                            row.map(function (elem, indexColumn) {
                                return <CaseAffichage indexRow={indexRow} indexColumn={indexColumn}
                                                      elem={elem}
                                                      visible={m.state.tabVisible[indexRow][indexColumn]}
                                                      click={() => m.cocheCase(indexRow, indexColumn)}
                                                      key={indexColumn}
                                ></CaseAffichage>
                            })
                        }
                    </tr>
                })
            }
            </tbody>
        </table>

    }

}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <hr/>
                <GrilleAffiche nb={4}></GrilleAffiche>
            </header>
        </div>
    );
}

export default App;
