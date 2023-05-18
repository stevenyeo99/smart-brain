import {Fragment} from 'react';

const Navigation = ({isSignedIn, onRouteChange}) => {
    return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            { isSignedIn && <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p> }
            { 
                !isSignedIn &&
                <Fragment>
                    <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                    <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
                </Fragment>
            }
        </nav>
    );
};

export default Navigation;