import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { useState } from 'react';

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  iconRight,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsHidden(!isHidden);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border-neutral-100 focus:border-primary-500 ${containerStyle}`}
            style={{
              borderColor: isFocused ? '#0286FF' : 'transparent',
              borderWidth: isFocused ? 1 : 1,
            }}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
              className={`rounded-full p-4 font-JakartaSemiBold placeholder:font-JakartaLight text-[15px] flex-1 ${inputStyle} text-left`}
              placeholderTextColor="#a0a0a0"
              secureTextEntry={isHidden}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...props}
            />
            {iconRight && (
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Image
                  source={iconRight}
                  className={`w-6 h-6 mr-4 ${iconStyle}`}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
