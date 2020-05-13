import React, { useState } from "react";
import { FAB, Portal, Provider } from "react-native-paper";
import { Icon } from "react-native-elements";
import { Colors } from "../config/Theming";
import chroma from "chroma-js";

export function ZoomTool({ onZoomIn, onZoomOut }) {
  const [open, setOpen] = useState(false);

  const propMap = {};

  const actions = [];
  if (onZoomIn) actions.push({ icon: "zoom-in", onPress: onZoomIn });
  if (onZoomOut) actions.push({ icon: "zoom-out", onPress: onZoomOut });

  return (
    <Provider
      settings={{
        icon: ({ name, ...props }) => {
          if (name === "magnify")
            return (
              <Icon
                {...props}
                name={name}
                type="material-community"
                size={28}
              />
            );
          else return <Icon {...props} name={name} />;
        },
      }}
    >
      <Portal>
        <FAB.Group
          open={open}
          visible={true}
          icon={"magnify"}
          actions={actions}
          onStateChange={() => setOpen((open) => !open)}
          fabStyle={{
            backgroundColor: chroma(Colors.primaryColor).luminance(0.07).hex(),
          }}
          style={{
            right: -10,
            bottom: -10,
          }}
        />
      </Portal>
    </Provider>
  );
}

export default ZoomTool;
