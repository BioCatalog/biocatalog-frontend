import StyledTitle from "@/components/styled-title";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Image, StatusBar, StyleSheet } from "react-native";

interface HeaderProps {
    title?: string
}

export default function Header({ title }: HeaderProps) {
    return (
        <Box style={styles.container}>
            <StatusBar animated={true} backgroundColor='#083E03' barStyle={"dark-content"} hidden />
            <HStack style={styles.hstack}>
                <Image style={{ width: 50, height: 50, marginRight: 10 }} source={require('../../../assets/logo/logoImage.png')} />
                <StyledTitle text={title ?? 'BioCatalog'} />
            </HStack>
        </Box>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        backgroundColor: '#126502',
        //marginTop: StatusBar.currentHeight
    },

    hstack: {
        padding: 5,
        alignItems: 'center'
    }
})