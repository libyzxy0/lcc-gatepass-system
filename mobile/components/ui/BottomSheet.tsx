import React, { forwardRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useColors } from "@/hooks/useColors";

type Props = {
  children: React.ReactNode;
  containerStyle?: string;
}
type Ref = BottomSheet;

export const BottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const colors = useColors();

  return (
    <BottomSheet
      ref={ref}
      keyboardBehavior="extend"
      index={-1}
      snapPoints={props.snapPoints}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: colors.card
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.primary['default']
      }}
      {...props}
    >
      <BottomSheetView style={props?.containerStyle}>{props.children}</BottomSheetView>
    </BottomSheet>
  );
});