import { YellowBox } from 'react-native';
import _ from 'lodash';

export class Warnings {
    static _console = _.clone(console);

    static ignoreList: Array<string> = []

    static ignore(toIgnore: string) {
        Warnings.ignoreList.push(toIgnore)
        YellowBox.ignoreWarnings(Warnings.ignoreList);
        console.ignoredYellowBox = Warnings.ignoreList.slice();
    }

    static warn(message: string) {
        for( const ignored of Warnings.ignoreList ) {
            if (message.startsWith(ignored)) {
                return 
            }
        }
        Warnings._console.warn(message);
    }
}

console.warn = Warnings.warn

export default Warnings