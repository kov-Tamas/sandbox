import styles from './Conway.module.css';
import Cell from './Cell';
import { Patterns } from './Patterns'; 
import { Component, createRef } from 'react';

interface ConwayProps {}
interface ConwayState {row:number, col:number, intervalTime:number, patternName:string, board:any[]}

const DEFAULT = 50

interface IPattern {
  size:number;
  name:string;
}

class Conway extends Component<ConwayProps,ConwayState> {
  state: ConwayState;
  cellRefs: any[];
  livingStack: number[];
  simulationInterval;
  possiblePatterns: IPattern[];

  constructor(props){
    super(props)
    this.cellRefs = [];
    this.livingStack = [];
    this.possiblePatterns = Object.keys(Patterns).map(prop => {
      return {size:Patterns[prop].size, name:prop}
    });
    const board = this.initBoard(DEFAULT, DEFAULT);
    this.state = { row:DEFAULT, col:DEFAULT, intervalTime:100, patternName:"Single", board:board }
  }

  componentDidMount(): void {
    document.addEventListener('cellStateChanged',this.updateLivingStack);
    document.addEventListener('cellReferenceIndex', this.applyPatternOnCell)
  }

  updateLivingStack = (e) =>{
    let { index, isAlive } = e.detail
    if(isAlive){
      this.livingStack.push(index);
    } else {
      this.livingStack = this.livingStack.filter(i=> i !== index);
    }
  }

  componentWillUnmount(): void {
    this.stopSimulation();
    document.removeEventListener('cellStateChanged', this.updateLivingStack)
    document.removeEventListener('cellReferenceIndex', this.applyPatternOnCell)
  }

  applyPatternOnCell = (e) => {
    const { patternName } = this.state
    const { index } = e.detail
    if(patternName==="Single")
    {
      this.state.board[index].ref.current.changeAliveState();
      return
    } else {
      this.applyPattern(index)
    }
  }

  stopSimulation = () => {
    clearInterval(this.simulationInterval)
    this.simulationInterval = null
  }

  initBoard = (row,col):Cell[] => {
    let board:any[] = []
    this.cellRefs = [];
    this.livingStack = this.livingStack.filter(index => index < row*col)
    for(let i = 0; i < row * col; i++){
      this.cellRefs.push(createRef());
      board.push(<Cell index={i} ref={this.cellRefs[i]}/>);
    }
    return board
  }
  
  shouldComponentUpdate(nextProps: Readonly<ConwayProps>, nextState: Readonly<ConwayState>, nextContext: any): boolean {
    const {row, col, intervalTime, patternName, board} = nextState
    
    if (this.state.patternName !== patternName) {
      this.setState({
        patternName:patternName
      });
      return true;
    }
    else if (this.state.intervalTime !== intervalTime) {
      this.setState({
        intervalTime:intervalTime
      });
      return true;
    }
    else if (this.state.row !== row || this.state.col !== col) {
      this.setState({
        row:row,
        col:col,
        board: board,
      });
      return true;
    }
    return false
  }


  toggleSimulation = (e) => {
    const {row, col } = this.state;
    if(this.simulationInterval)
    {
      this.stopSimulation();
    } else {
      this.simulationInterval = setInterval((row,col) => {
        let newStack:number[] = [];
        this.livingStack.forEach(index => {
          this.willCellLive(index, newStack);
        });

        this.livingStack = newStack;
      }, this.state.intervalTime, row, col);
    }
  }

  willCellLive = (index, livingStack) => {
    const neighbours: any[] = []
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        const neighbourIndex = index+(i * this.state.col + j);
        if(this.state.board[neighbourIndex]){
          if(this.livingStack.includes(index) && !this.livingStack.includes(neighbourIndex) && !livingStack.includes(neighbourIndex)){
            this.willCellLive(neighbourIndex, livingStack);
          }
          if(index !== neighbourIndex){
            const neighbourCellState = this.state.board[neighbourIndex].ref.current.state.isAlive
            neighbours.push(neighbourCellState);
          }
        }
      }
    }
    const newState = this.state.board[index].ref.current.shouldILive(neighbours);
    if(newState && !livingStack.includes(index)){
      livingStack.push(index);
    }
  }

  applyPattern = (startIndex) => {
    const { row, col, patternName } = this.state;
    let {size, pattern} = Patterns[patternName];
    let offsetCol = col - size

    if(col !== size){
      pattern = pattern.map(index => {
        let indexOriginRow = Math.floor(index/size);
        let offsetAmount = indexOriginRow * offsetCol;
        return index + offsetAmount;
      });
    }

    let max = Math.max(...pattern) + startIndex
    if(max > row*col){
      console.warn('Pattern doesn fit on board from selected cell')
    } else {
      pattern.forEach(index => {
        this.state.board[index + startIndex].ref.current.changeAliveState();
      })
    }
  }

  setRow = (e) => {
    const row = e.target.value
    const {col} = this.state
    let value;
    try{
      value = parseInt(row);
      if(value < 1){
        throw Error;
      }
    } catch {
      console.warn('Failed to set row, setting default 25');
      value = 25;
    }
    if(row){
      const board = this.initBoard(row,col);
      this.setState({
        row: value,
        board: board
      });
    }
  }

  setCol = (e) => {
    const col = e.target.value
    const {row} = this.state
    let value;
    try{
      value = parseInt(col);
      if(value < 1){
        throw Error;
      }
    }catch{
      console.warn('Failed to row col, setting default 25');
      value = 25;
    }
    if(col){
      const board = this.initBoard(row,col);
      this.setState({
        col: value,
        board: board
      });
    }
  }

  setIntervalTime = (e) => {
    const time = e.target.value
    let value;
    
    try{
      value = parseInt(time);
      if(value < 1){
        throw Error;
      }
    } catch {
      console.warn('Failed to set time, setting default 100MS');
      value = 100;
    }
    this.setState({
      intervalTime: value
    });
  }

  setPatternName = (e) => {
    let value = e.target.value;
    this.setState({ patternName: value })
  }

  render = () => {
    const {row, col, intervalTime, board} = this.state;
    
    return <div className={styles.container}>
      <div className={styles.conway} style={{grid: `auto-flow / repeat(${this.state.col}, 1fr)`}}>
        {board}
      </div>
      <div  className={styles.conwayOptions}>
        <button onClick={this.toggleSimulation}>Toggle Simulation</button>
        <div>
          Row 
          <input onInput={this.setRow} value={row}/>
        </div>
        <div>
          Col 
          <input onInput={this.setCol} value={col}/>
        </div>
        <div>
          IntervalTimeInMS 
          <input onInput={this.setIntervalTime} value={intervalTime}/>
        </div>
        <div>
        Select
        <select onChange={this.setPatternName}>
          {this.possiblePatterns.map(pattern => <option value={pattern.name}>{pattern.name} ({pattern.size}x{pattern.size})</option>)}
        </select>
      </div>
      </div>
    </div>
  }
}

export default Conway;
