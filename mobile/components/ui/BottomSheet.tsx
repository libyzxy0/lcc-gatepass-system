import React, { forwardRef } from "react";
import DefaultBottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useColors } from "@/hooks/useColors";

type Props = {
  children: React.ReactNode;
  containerStyle?: string;
}
type Ref = DefaultBottomSheet;

export const BottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const colors = useColors();

  return (
    <DefaultBottomSheet
      ref={ref}
      keyboardBehavior="extend"
      index={-1}
      snapPoints={props.snapPoints}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.input,
        borderRadius: 50
      }}
      {...props}
    >
      <BottomSheetView style={props?.containerStyle}>{props.children}</BottomSheetView>
    </DefaultBottomSheet>
  );
});