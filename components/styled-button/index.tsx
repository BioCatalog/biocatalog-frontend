import { StyleSheet } from "react-native";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { InterfaceButtonProps } from "@gluestack-ui/button/lib/types";

interface StyledButtonProps extends InterfaceButtonProps {
    text: string,
    textColor?: string,
    color?: string,
    onClick: () => void,
    load?: boolean,
    style?: object
}

export default function StyledButton({ text, onClick, color, textColor, load, style: externalStyle, ...rest }: StyledButtonProps) {
    return (
        <Button {...rest}
            style={[style.button, { backgroundColor: color ? color : "black" }, externalStyle]}
            onPress={onClick}
            isDisabled={load}>
            <ButtonText style={{ color: textColor ? textColor : "white" }}>{text}</ButtonText>
            {load && <ButtonSpinner />}
        </Button>
    )
}

const style = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})