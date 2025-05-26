import AuthScreen from "@/components/auth-screen";
import StyledButton from "@/components/styled-button";
import StyledInput from "@/components/styled-input";
import { useAuth } from "@/context/auth";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Login() {
    const auth = useAuth();

    return (
        <AuthScreen>
            <View style={style.containerFieds}>
                <StyledInput placeholder="Digite seu email" label="Email" type="text" onChangeText={(data) => { auth.setUser({ ...auth.user, email: data }) }} />
                <StyledInput placeholder="Digite sua senha" label="Senha" type="password" onChangeText={(data) => { auth.setUser({ ...auth.user, password: data }) }} />
            </View>
            <StyledButton onClick={auth.handleLogin} text="Entrar" color="#509044" />
            <Text style={{ marginTop: 15 }} onPress={() => { router.replace('/userRegister') }}>
                Cadastre-se <Text style={{ fontWeight: "bold", color: "green" }}>AQUI!</Text>
            </Text>
            <View style={{ marginTop: 40 }}>
                <Text underline={true} onPress={() => { router.replace('/main/(tabs)'); auth.handleLogin(true); }}>
                    Ou continuar sem conta
                </Text>
            </View>
        </AuthScreen>
    )
}

const style = StyleSheet.create({
    containerFieds: {
        width: '100%',
        margin: 20,
        padding: 20
    },
    logoImage: {
        height: 150,
        aspectRatio: 1
    }
})