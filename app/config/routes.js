import { StackNavigator, navigationOptions } from 'react-navigation';

import Decks from '../screens/Decks';
import ShowDeck from  '../screens/ShowDeck';

const HomeStack = StackNavigator(
    {
        Home: {
            screen: Decks,
            navigationOptions: {
                header: null,
            },
        },
        ShowDeck: {
            screen: ShowDeck,
            navigationOptions: {
                header: null,
            },
        },
    },
    {
        navigationOptions: { header: null}  
    }
);

export default StackNavigator(
    {
        Home: {
            screen: HomeStack,
        },
    }, 
    {
        mode: 'modal',
        headerMode: 'none',
    },
);
