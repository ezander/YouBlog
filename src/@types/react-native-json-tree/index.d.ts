declare module "react-native-json-tree" {
  interface JSONTreeProps {
    data: Array<any> | boolean | number | object | string;
    hideRoot?: boolean;
    invertTheme?: boolean;
    keyPath?: Array<string | number>;
    postprocessValue?: () => void;
    sortObjectKeys?: (key1, key2) => number | boolean;
    theme?: object | string;
    labelRenderer?: (raw) => JSX.Element; //{raw => <Text style={{ fontWeight: 'bold' }}>{raw}</Text>}
    valueRenderer?: (raw) => JSX.Element; // {raw => <Text style={{ fontStyle: 'italic' }}>{raw}</Text>}
    shouldExpandNode?: (keyName, data, level) => boolean; // determines if node should be expanded (root is expanded by default)
  }

  export class JSONTree extends React.Component<JSONTreeProps> {}

  export default JSONTree;
}
