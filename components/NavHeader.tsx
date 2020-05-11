import {
  StackHeaderProps,
  StackNavigationOptions,
} from "@react-navigation/stack";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Header } from "react-native-elements";
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import { HeaderTheme } from "../config/Theming";
import ThemedIcon, { SpecialisedThemedIconProps } from "./ThemedIcon";

export type ExtendedNavigationOptions = StackNavigationOptions & {
  onOpenMenu?: any;
  extraHeaderItems?: Array<JSX.Element>;
};

export function IconComponent(props: SpecialisedThemedIconProps) {
  const iconSize = HeaderTheme.iconSize;
  const iconColor = HeaderTheme.iconColor;
  return (
    <ThemedIcon
      theme={HeaderTheme.iconTheme}
      {...props}
      size={iconSize}
      color={iconColor}
    />
  );
}

export const ThemedHeaderButton = (props: any) => {
  return <HeaderButton IconComponent={IconComponent} {...props} />;
};

function NavHeader({ headerProps }: { headerProps: StackHeaderProps }) {
  const { scene, previous, navigation } = headerProps;

  const options = scene.descriptor.options as ExtendedNavigationOptions;
  let title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  const onOpenMenu = options.onOpenMenu;
  const leftHeaderItems: Array<JSX.Element> = [];
  const rightHeaderItems: Array<JSX.Element> = [];

  if (options.extraHeaderItems) {
    for (const item of options.extraHeaderItems) rightHeaderItems.push(item);
  }

  if (previous) {
    leftHeaderItems.push(
      <Item
        key="back"
        title="Back"
        iconName="back"
        onPress={navigation.goBack}
      />
    );
  }
  if (onOpenMenu) {
    leftHeaderItems.push(
      <Item key="menu" title="Menu" iconName="menu" onPress={onOpenMenu} />
    );
  }

  // rightHeaderItems.push(<Avatar rounded title="EZ" key="avatar" />)

  const leftComponent = (
    <HeaderButtons
      HeaderButtonComponent={ThemedHeaderButton}
      OverflowIcon={<IconComponent name="more" />}
      children={leftHeaderItems}
    />
  );

  const rightComponent = (
    <HeaderButtons
      HeaderButtonComponent={ThemedHeaderButton}
      OverflowIcon={<IconComponent name="more" />}
      children={rightHeaderItems}
    />
  );
  // const rightComponent = <Avatar rounded title="EZ" key="avatar" />

  const centerComponent = {
    text: title,
    style: styles.headerComponents,
  };

  return (
    <Header
      leftComponent={leftComponent}
      centerComponent={centerComponent}
      rightComponent={rightComponent}
      containerStyle={styles.headerContainer}
    />
  );
}

export default NavHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 0,
    height: Platform.select({
      android: 50,
      default: 44,
    }),
    backgroundColor: HeaderTheme.backgroundColor,
  },
  headerComponents: {
    color: HeaderTheme.textColor,
    fontSize: HeaderTheme.fontSize,
  }
});
