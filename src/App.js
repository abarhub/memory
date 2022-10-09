import logo from './logo.svg';
import './App.css';
import React from "react";

class Case {
    constructor(text, visible, row, column) {
        this.text = text;
        this.visible = visible;
        this.row = row;
        this.column = column;
    }
}

class CaseAffichage extends React.Component {

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

    classeAAjouter(text) {
        let res = '';
        if (text && text.length > 0) {
            res = 'case-' + text;
        }
        return res;
    }

    render() {
        const elem = this.props.elem;
        const visible = elem.visible;
        if (visible) {
            let classe = 'case visible';
            classe += ' ' + this.classeAAjouter(elem.text);
            return <td className={classe}>{elem.text}</td>
        } else {
            return <td className="case cachee" onClick={this.coche.bind(this)}> </td>
        }
    }

}

class GrilleAffiche extends React.Component {

    constructor(props) {
        super(props);
        const nb = props.nb;
        const tab = [];
        for (let i = 0; i < nb; i++) {
            let row = [];
            tab.push(row);
            for (let j = 0; j < nb; j++) {
                row.push(new Case("", false, i, j));
            }
        }
        this.initialiseTableau(tab, nb);
        this.state = {tab: tab, nb: nb, derniereCase: null};
        this.cocheCase = this.cocheCase.bind(this);
    }

    initialiseTableau(tab, nb) {
        let text = 'a';
        let no = 0;
        for (let i = 0; i < nb; i++) {
            for (let j = 0; j < nb; j++) {
                tab[i][j].text = text;
                if ((no + 1) % 2 === 0) {
                    text = this.nextChar(text.charAt(0));
                }
                no++;
            }
        }
        for (let i = 0; i < no; i++) {
            const pos = Math.floor(Math.random() * no);
            const decalage = Math.floor(Math.random() * no) + 1;
            const pos2 = (pos + decalage) % no;
            const pos01 = this.getPos(pos, nb);
            const pos02 = this.getPos(pos2, nb);
            const text1 = tab[pos01.row][pos01.columns].text;
            const text2 = tab[pos02.row][pos02.columns].text;
            tab[pos01.row][pos01.columns].text = text2;
            tab[pos02.row][pos02.columns].text = text1;
        }
    }

    getPos(pos, nb) {
        return {
            row: Math.floor(pos / nb),
            columns: pos % nb
        };
    }

    nextChar(c) {
        var i = (parseInt(c, 36) + 1) % 36;
        return (!i * 10 + i).toString(36);
    }

    cocheCase = (indexRow, indexColumn) => {
        if (indexRow >= 0 && indexColumn >= 0 && this && this.state) {
            const tab = [];
            const nb = this.state.nb;
            let derniereCase = null;
            let precedanteDerniereCase = this.state.derniereCase;
            for (let i = 0; i < nb; i++) {
                let row = [];
                tab.push(row);
                for (let j = 0; j < nb; j++) {
                    let visible = false
                    if (i === indexRow && j === indexColumn) {
                        visible = true;
                        derniereCase = this.state.tab[i][j];
                    } else {
                        visible = this.state.tab[i][j].visible;
                    }
                    row.push(new Case(this.state.tab[i][j].text, visible, i, j));
                }
            }
            this.setState({
                tab: tab,
                derniereCase: (precedanteDerniereCase != null) ? null : derniereCase
            });
            if (precedanteDerniereCase != null) {
                if (precedanteDerniereCase.text !== derniereCase.text) {
                    // les 2 cases ne sont pas les mêmes => elles sont cachées
                    let m = this;
                    let call = () => {
                        m.rollback(precedanteDerniereCase.row, precedanteDerniereCase.column,
                            derniereCase.row, derniereCase.column);
                    }
                    setTimeout(call, 500);
                } else {
                    // les 2 cases sont identiques => on les laisse affichées
                }
            }
        }
    }

    /**
     * cache les 2 cases
      */
    rollback(row1, col1, row2, col2) {
        const tab = [];
        const nb = this.state.nb;
        for (let i = 0; i < nb; i++) {
            let row = [];
            tab.push(row);
            for (let j = 0; j < nb; j++) {
                let visible = false;
                visible = this.state.tab[i][j].visible;
                row.push(new Case(this.state.tab[i][j].text, visible, i, j));
            }
        }
        tab[row1][col1].visible = false;
        tab[row2][col2].visible = false;
        this.setState({tab: tab, derniereCase: null});
    }


    render() {

        let m = this;

        return <table border="1">
            <tbody>
            {
                this.state.tab.map(function (row, indexRow) {
                    return <tr>
                        {
                            row.map(function (elem, indexColumn) {
                                return <CaseAffichage indexRow={indexRow} indexColumn={indexColumn}
                                                      elem={elem}
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
                <GrilleAffiche nb={6}></GrilleAffiche>
            </header>
        </div>
    );
}

export default App;
