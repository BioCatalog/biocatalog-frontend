import StyledInput from "@/components/styled-input"
import { ScrollView, StyleSheet, View, Text } from "react-native"
import { useAuth } from "@/context/auth"
import StyledButton from "@/components/styled-button";
import { router } from "expo-router";
import { useState } from "react";
import { UserProps } from "@/interfaces/user";

export default function EditPass() {

    const auth = useAuth();

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");

    return (
        <ScrollView style={style.container}>
            <Text style={style.title}>Editar senha</Text>
            <StyledInput label="Senha atual" onChangeText={(pass) => { setOldPass(pass) }} type="password" defaultValue={""} />
            <StyledInput label="Senha nova" onChangeText={(pass) => { setNewPass(pass) }} type="password" defaultValue={""} />
            <StyledInput label="Confirme senha nova" onChangeText={(pass) => { setNewPass(pass) }} type="password" defaultValue={""} />

            <View style={style.buttonRow}>
                <StyledButton style={style.saveButton} onClick={() => auth.handleChangePass(oldPass, newPass)} text="Salvar" color="#297d28" />
                <StyledButton style={style.cancelButton} onClick={() => { router.replace('/main/content/editProfile') }} text="Cancelar" color="#469158" />
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 23
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100
    }

})