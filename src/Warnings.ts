import { YellowBox } from 'react-native';
import _ from 'lodash';

export class Warnings {
    static _console = _.clone(console);

    static ignoreList: Array<string> = []

    static ignore(toIgnore: string) {
        YellowBox.ignoreWarnings([toIgnore]);
        console.ignoredYellowBox = [toIgnore];
        Warnings.ignoreList.push(toIgnore)
    }

    static warn(message: string) {
        for( const ignored of Warnings.ignoreList ) {
            if (message.indexOf(ignored) >= 0) return 
        }
        Warnings._console.warn(message);
    }
}

console.warn = Warnings.warn

export default Warnings