import { Component } from 'react';
import styles from './WaveFunctionCollapse.module.css';
import Examples from './images/Examples';

interface WaveFunctionCollapseProps {}

class WaveFunctionCollapse extends Component {
  images;
  
  constructor(props){
    super(props)
    this.images =[];
    Object.keys(Examples).forEach(key => {
      this.images.push({name:key, img:Examples[key]});
    })
  }


  render(){
    let renderImages = this.images.map(img => {
      return <div>
          {img.name}
          <img className={styles.imgcontainer} src={img.img}/>
        </div>
    })

    return <div className={styles.container}>
      {renderImages}
    </div>
  }
}

export default WaveFunctionCollapse;
