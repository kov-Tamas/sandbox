import { Component } from 'react';
import styles from './Conway.module.css';
import * as ko from 'knockout';

interface CellProps {
  index: number;
}

interface CellState {
  isAlive: boolean;
}

class Cell extends Component<CellProps, CellState> {
  state;
    
  constructor (props) {
    super(props)
    this.state = {
      isAlive: false
    }
    this.changeAliveState = this.changeAliveState.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.shouldILive = this.shouldILive.bind(this);
  }

  changeAliveState = () => {
    const {isAlive} = this.state
    const {index} = this.props
    let nextState = !isAlive
    this.setState({
      isAlive: nextState
    });
    document.dispatchEvent(new CustomEvent('cellStateChanged',{detail: {index:index, isAlive:nextState}}));
  }

  shouldILive = (neighbours:boolean[]): boolean => {
    const livingNeighbours = neighbours.filter(isAlive => isAlive);
    const livingNeighbourCount = livingNeighbours.length
    if((livingNeighbourCount === 2 || livingNeighbourCount === 3) && this.state.isAlive){
      return true
    }
    if (livingNeighbourCount === 3){ 
      this.setState({isAlive: true});
      return true
    }
    this.setState({isAlive: false});
    return false
  }

  onCellClick = () => {
    document.dispatchEvent(new CustomEvent('cellReferenceIndex',{detail:{index:this.props.index}}))
  }
  
  render = () => {
    const { isAlive } = this.state;
    let aliveClass = isAlive ? styles['alive'] : styles['dead'];
    let classes = `${styles['cell']} ${aliveClass}`;
    return  <div className={classes} onClick={this.onCellClick}/>
  }
}

export default Cell;