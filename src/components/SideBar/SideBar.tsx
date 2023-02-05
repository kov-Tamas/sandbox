import React, { FC, useState } from 'react';
import styles from './SideBar.module.css';
import * as ko from 'knockout';
import { Router, useNavigate } from 'react-router-dom';

interface SideBarProps {
  routeObservable: ko.Observable<String>;
  routes: SideBarItemState[];
}

interface SideBarState {
  routes: SideBarItemState[];
} 

interface SideBarItemProps {
  label:String;
  value:String;
  routeObservable:Function;
}

interface SideBarItemState {
  label:String;
  value:String;
}

class SideBarItem extends React.Component<SideBarItemProps, SideBarItemState> {
  routeObservable;

  constructor(props){
    super(props);
    this.state = {label: props.label, value: props.value};
    this.routeObservable = props.routeObservable;
  }

  onItemSelect = (event) => {
    this.routeObservable(this.state.value)
  }

  render = () => {
    return <div className={styles['sidebarOption']} onClick={this.onItemSelect}>{this.state.label}</div>
  }
}

class SideBar extends React.Component<SideBarProps,SideBarState> {
  routeObservable:ko.Observable<String>;

  constructor(props:SideBarProps) {
    super(props)
    this.routeObservable = props.routeObservable;
    this.state = {routes: props.routes};
  }

  render = () => {
    const routes = this.state.routes;
    const renderedItems = routes.map(route => <SideBarItem label={route.label} value={route.value} routeObservable={this.routeObservable}/>)

    return  <div className={styles.sidebar}>
      {renderedItems}
    </div>
  }
};

export default SideBar