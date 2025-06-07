import StyledButton from "@/components/styled-button";
import StyledConfirmation from "@/components/styled-confirmation";
import { useAuth } from "@/context/auth";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Profile() {
    const auth = useAuth();

    return (
        <View style={style.container}>
            {/* <View style={style.profileFrame}>
                <View style={style.profilePhoto}><Text>Foto de perfil</Text></View>
            </View> */}
            <Text style={style.title}>Olá, {auth.userInfo.name}</Text>
            <Text style={style.present1}>Formação:</Text>
            <Text style={style.present2}>{auth.userInfo.form}</Text>
            <Text style={style.present1}>E-mail:</Text>
            <Text style={style.present2}>{auth.userInfo.email}</Text>
            <View style={{ marginTop: 20, width: '75%' }}>
                {
                    auth.userInfo.email == 'local' ?
                        <StyledConfirmation
                            firClick={() => { router.navigate("/userRegister") }} firLabel="Registrar" firColor="green"
                            secClick={() => { router.navigate("/") }} secLabel="Login" secColor="blue" />
                        :
                        <View style={style.buttonRow}>
                            <StyledButton style={style.editButton} onClick={() => { router.replace('/main/content/editProfile') }} text="Editar perfil" color="#297d28" />
                            <StyledButton style={style.exitButton} onClick={auth.handleLogout} text="Sair" color="#A41718" />
                        </View>
                }
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 2,
        marginBottom: 15
    },
    present1: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10
    },
    present2: {
        fontSize: 15,
        marginLeft: 15
    },
    // profileFrame: {
    //     width: 80,
    //     height: 80,
    //     backgroundColor: "black",
    //     alignItems: "center",
    //     justifyContent: "center"
    // },
    // profilePhoto: {
    //     width: 75,
    //     height: 75,
    //     backgroundColor: "green"
    // },
    editButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120
    },
    exitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})