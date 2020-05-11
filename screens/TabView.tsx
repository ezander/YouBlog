import React, { useState } from "react";
import { LayoutAnimation, StyleSheet, UIManager, View } from "react-native";
import { Button, ButtonProps } from "react-native-elements";
import { SCREEN_WIDTH, useTheme } from "../config/Theming";

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const TabSelector = ({ selected }: { selected: boolean }) => {
  const theme = useTheme()
  const themeStyles = theme.TabView

  return (
    <View style={styles.selectorContainer}>
      <View style={selected && {...themeStyles.selected, ...styles.selected}} />
    </View>
  );
};

export interface TabViewProps {
  titles: [string, string];
  children: [JSX.Element, JSX.Element];
  disabled?: boolean;
  initialCategory?: number;
  onChangeCat?: (category: number, catTitle: string) => any;
}

export function TabView({
  disabled,
  initialCategory,
  titles,
  onChangeCat: onCatChange,
  children,
}: TabViewProps) {
  const theme = useTheme()
  const themeStyles = theme.TabView
  const [category, setCategory] = useState(initialCategory || 0);

  onCatChange && onCatChange(category, titles[category]);

  function selectCategory(category: number) {
    LayoutAnimation.easeInEaseOut();
    setCategory(category);
    onCatChange && onCatChange(category, titles[category]);
  }

  const buttonProps = (cat: number) =>
    ({
      disabled: disabled,
      type: "clear",
      activeOpacity: 0.7,
      containerStyle: { flex: 1, marginBottom: -10 },
      titleStyle: [
        {...themeStyles.categoryText, ...styles.categoryText},
        cat == category && styles.selectedCategoryText,
      ],
    } as ButtonProps);

  return (
    <View style={{ width: SCREEN_WIDTH }}>
      <View style={{ flexDirection: "row" }}>
        <Button
          {...buttonProps(0)}
          onPress={() => selectCategory(0)}
          title={titles[0] + "  "}
        />
        <Button
          {...buttonProps(1)}
          onPress={() => selectCategory(1)}
          title={titles[1] + "  "}
        />
      </View>
      <View style={styles.rowSelector}>
        <TabSelector selected={category == 0} />
        <TabSelector selected={category == 1} />
      </View>
      <View style={styles.contentView}>
        {children[category]}
      </View>
    </View>
  );
}

export default TabView;

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //   },
  contentView: {
    // width: SCREEN_WIDTH-20,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  rowSelector: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  selectorContainer: {
    flex: 1,
    alignItems: "center",
  },
  selected: {
    position: "absolute",
    borderRadius: 50,
    height: 0,
    width: 0,
    top: -5,
    borderRightWidth: 70,
    borderBottomWidth: 70,
  },
  categoryText: {
    backgroundColor: "transparent",
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
});
