import logo from './logo.svg';
import './App.css';
import React from "react";

class Case {
    constructor(text, visible, row, column) {
        this.text = text;
        this.visible = visible;
        this.row = row;
        this.column = column;
        this.backgroundColor = '';
        this.color = '';
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
            //classe += ' ' + this.classeAAjouter(elem.text);
            let style = '';
            if (elem.color) {
                style = {color: elem.color};
            }
            return <td className={classe} style={{backgroundColor: elem.color}}>{elem.text}</td>
        } else {
            return <td className="case cachee" onClick={this.coche.bind(this)}></td>
        }
    }

}

class GrilleAffiche extends React.Component {

    constructor(props) {
        super(props);
        // création du tableau
        const nb = props.nb;
        const tab = [];
        for (let i = 0; i < nb; i++) {
            let row = [];
            tab.push(row);
            for (let j = 0; j < nb; j++) {
                let case0 = new Case("", false, i, j);
                case0.color = '';
                row.push(case0);
            }
        }
        // initialisation des valeurs aléatoires du tableau
        this.initialiseTableau(tab, nb);
        // initialisation du state
        this.state = {tab: tab, nb: nb, derniereCase: null, desactiveClick: false, showModal:false};
        this.cocheCase = this.cocheCase.bind(this);
    }

    initialisation(nbCases){
        const tab = [];
        for (let i = 0; i < nbCases; i++) {
            let row = [];
            tab.push(row);
            for (let j = 0; j < nbCases; j++) {
                let case0 = new Case("", false, i, j);
                case0.color = '';
                row.push(case0);
            }
        }
        // initialisation des valeurs aléatoires du tableau
        this.initialiseTableau(tab, nbCases);
        this.setState({
            tab: tab, nb: nbCases, derniereCase: null, desactiveClick: false, showModal:false
        });
    }

    /**
     * Initialisation avec des valeurs aléatoires du tableau
     * @param tab le tableau à initialiser
     * @param nb le nombre de ligne et de colonnes du tableau
     */
    initialiseTableau(tab, nb) {

        const textePossibles = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const couleursPossibles = this.getListColor(Math.ceil(nb * nb / 2));
        console.log('couleursPossibles', couleursPossibles);
        let no = 0;
        let no2 = 0;
        let text = textePossibles.charAt(no2);
        for (let i = 0; i < nb; i++) {
            for (let j = 0; j < nb; j++) {
                tab[i][j].text = text;
                tab[i][j].color = couleursPossibles[no2];
                if ((no + 1) % 2 === 0) {
                    no2++;
                    text = textePossibles.charAt(no2);
                }
                no++;
            }
        }
        for (let i = 0; i < no * 2; i++) {
            const pos = Math.floor(Math.random() * no);
            const decalage = Math.floor(Math.random() * no) + 1;
            const pos2 = (pos + decalage) % no;
            const pos01 = this.getPos(pos, nb);
            const pos02 = this.getPos(pos2, nb);
            const text1 = tab[pos01.row][pos01.columns].text;
            const color1 = tab[pos01.row][pos01.columns].color;
            const text2 = tab[pos02.row][pos02.columns].text;
            const color2 = tab[pos02.row][pos02.columns].color;
            tab[pos01.row][pos01.columns].text = text2;
            tab[pos01.row][pos01.columns].color = color2;
            tab[pos02.row][pos02.columns].text = text1;
            tab[pos02.row][pos02.columns].color = color1;
        }
    }

    // retourne un nuancier de couleur
    getListColor(max) {
        let tab = [];
        let decoupeLuminance = 3;
        const n = Math.ceil(360 / max);

        for (let i = 0; i < decoupeLuminance; i++) {
            let luminance = '';
            if (i === 0) {
                luminance = '30%';
            } else if (i === 1) {
                luminance = '40%';
            } else {
                luminance = '50%';
            }
            let no = 0;
            for (let j = 0; j < Math.ceil(max / decoupeLuminance); j++) {
                tab.push('hsl(' + (n * j) + ',' + luminance + ',40%)');
            }
        }
        return tab;
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
        if (indexRow >= 0 && indexColumn >= 0 && this && this.state && !this.state.desactiveClick) {
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
                    let case0 = new Case(this.state.tab[i][j].text, visible, i, j);
                    case0.color = this.state.tab[i][j].color;
                    row.push(case0);
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
                    this.setState({
                        desactiveClick: true
                    });
                    let call = () => {
                        m.rollback(precedanteDerniereCase.row, precedanteDerniereCase.column,
                            derniereCase.row, derniereCase.column);
                        this.setState({
                            desactiveClick: false
                        });
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
                let case0 = new Case(this.state.tab[i][j].text, visible, i, j);
                case0.color = this.state.tab[i][j].color;
                row.push(case0);
            }
        }
        tab[row1][col1].visible = false;
        tab[row2][col2].visible = false;
        this.setState({tab: tab, derniereCase: null});
    }

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });

    nouvelleGrille(){
        const nbCases = document.getElementById('nbCases')

        const nb=nbCases.value;
        console.log("nb",nb);
        if(nb>4){
            this.initialisation(nb);
        }
        this.closeModal();
    }

    render() {

        let m = this;

        return <div>
                <div>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={m.openModal}>
                        Launch demo modal
                    </button>
                    { this.state.isOpen ?
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                         aria-hidden="true" >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div>Nb Cases : <input type={"number"} id={"nbCases"} value="6"/></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={m.closeModal}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={()=>m.nouvelleGrille()}>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        : null }
                </div>
                <div>
                    <table border="1">
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
                </div>
            </div>

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
