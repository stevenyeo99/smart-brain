import { Component, Fragment } from 'react';
import ParticlesBg from 'particles-bg'

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

import './App.css';
import 'tachyons';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {

  constructor() {
    super();

    this.state = initialState;
  }

  loadUser = (data) => {

    const { id, name, email, entries, joined } = data;

    this.setState({
      user: {
        id,
        name,
        email,
        entries,
        joined
      }
    })
  }

  routeChangeHandler = (route) => {
    if (route === 'home') {
      this.setState({isSignedIn: true});
    } else if (route === 'signout') {
      this.setState(initialState);
    }

    this.setState({route: route});
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const inputImage = document.getElementById('inputImage');
    const width = Number(inputImage.width);
    const height = Number(inputImage.height);
    console.log(clarifaiFace);
    console.log(width, height);

    return {
      leftCol: width * clarifaiFace.left_col,
      topRow: height * clarifaiFace.top_row,
      rightCol: width - (width * clarifaiFace.right_col),
      bottomRow: height - (height * clarifaiFace.bottom_row)
    };
  };

  displayFaceBox = (box) => {
    this.setState({box});
  };

  inputChangeHandler = (event) => {
    this.setState({input: event.target.value});
  };

  buttonSubmitHandler = (event) => {
    const IMAGE_URL = this.state.input;
    this.setState({imageUrl: IMAGE_URL});

    fetch("http://localhost:3000/imageUrl", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: IMAGE_URL
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to detect face.');
        }

        return response.json()
      })
      .then(result => {
        fetch('http://localhost:3000/image', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: this.state.user.id })
        }).then(response => response.json())
        .then(user => {
          if (user) {
            this.setState({
              user: Object.assign(this.state.user, { entries: user.entries })
            });
          }
        }).catch(console.log)

        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch(error => console.log('error', error));
  }

  render() {
    const { inputChangeHandler, buttonSubmitHandler, routeChangeHandler, loadUser } = this;
    const { box, imageUrl, isSignedIn, route, user } = this.state;

    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} 
          onRouteChange={routeChangeHandler}
        />

        {
          (isSignedIn) ?
          (
            <Fragment>
              <Logo />
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm onInputChange={inputChangeHandler} onButtonSubmit={buttonSubmitHandler} />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </Fragment>
          )
          :
          (
            route === 'register' ? 
              <Register onRouteChange={routeChangeHandler} loadUser={loadUser} /> 
              : 
              <Signin onRouteChange={routeChangeHandler} loadUser={loadUser} />
          )
        }
        
        <ParticlesBg type="cobweb" bg={true} color='#FFFFFF'/>
      </div>
    );
  }
}

export default App;
