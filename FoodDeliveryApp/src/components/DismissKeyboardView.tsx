import {Keyboard, TouchableWithoutFeedback, type ViewProps} from 'react-native';
import React, {FC} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const DismissKeyboardView: FC<ViewProps> = ({children, ...props}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView {...props} style={props.style}>
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
