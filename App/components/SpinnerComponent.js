import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay'
import colors from '../colors.json'

function SpinnerComponent(props) {
    return (
        <Spinner
            textContent='Loading...'
            visible={props.isLoading}
            textStyle={{
                color: 'white'
            }}
            overlayColor={colors.background}
            animation={'slide'}
        />
    );
}

export default SpinnerComponent
