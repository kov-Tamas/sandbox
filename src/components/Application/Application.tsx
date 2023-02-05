import React from 'react';
import styles from './Application.module.css';
import * as ko from 'knockout';
import { BrowserRouter as Route, RouterProvider } from 'react-router-dom';
import {
  createBrowserRouter,
} from "react-router-dom";

//Routing Component
import SideBar from '../SideBar/SideBar';

//Pages
import Conway from '../Conway/Conway';
import HomePage from '../HomePage/HomePage';
import WaveFunctionCollapse from '../WaveFunctionCollapse/WaveFunctionCollapse';

interface ApplicationProps {}
class Application extends React.Component<ApplicationProps> {
  navigate;
  routeObservable;
  router;
  routes = [
    {label:"Home Page",value:"/"},
    {label:"WFC",value:"/wfc"},
    {label:"Conway",value:"/conway"}
  ]
  constructor(props){
    super(props);
    this.routeObservable = ko.observable();
    this.subscribeToRouting();
    this.router = createBrowserRouter([
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/conway",
        element: <Conway/>
      },
      {
        path: "/wfc",
        element: <WaveFunctionCollapse/>
      },
    ]);
  }

  subscribeToRouting = () => {
    this.routeObservable.subscribe(newRoute => {
      this.router.navigate(newRoute);
    });
  }
  
  render = () => {
    return <div className={styles['Site']}>
      
      <div className={styles['SideBarContainer']}>
        <SideBar routeObservable={this.routeObservable} routes={this.routes}/>
      </div>
      <div className={styles['ApplicationContainer']}>
        <RouterProvider router={this.router}/>
      </div>
    </div>   
  }
}

export default Application;

