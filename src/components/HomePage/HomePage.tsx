import React, { FC } from 'react';
import styles from './HomePage.module.css';

interface HomePageProps {}

class HomePage extends React.Component{

  render = () => {
    return <div className={styles.HomePage}>
      HomePage Component, szozsi kocsog
    </div>
  }
};

export default HomePage;
