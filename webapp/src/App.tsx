import React from 'react';
import {
    HashRouter as Router,
    Link,
    Switch,
    Route,
    useParams
} from 'react-router-dom';

import Gallery from './Gallery';

function RouteWithSubRoutes(route) {
    return (
      <Route
        path={route.path}
        render={props => (
          // pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes} />
        )}
      />
    );
  }

export default function App()
{   
    return <Gallery />
    // return <Router>    
    //     <Switch>
    //         <RouteWithSubRoutes path="/:prefix" children={<Gallery />} />
    //         <Route children={<Gallery />} />
    //     </Switch>
    // </Router>;
}