import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main: {//Opições e configurações para a main
            screen: Main,
            navigationOptions: {
                title: 'Dev Radar',
            },
        },

        Profile: {//Opições e configurações para a Profile
            screen: Profile,
            navigationOptions: {
                title: 'Perfil Github',
            }
        }
    }, {
        defaultNavigationOptions: {//Opições e configurações para todas as telas
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#7159c1',
            }
        },
    })
);

export default Routes;