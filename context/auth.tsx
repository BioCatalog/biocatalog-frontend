import { router } from "expo-router"
import { createContext, ReactNode, useContext, useState } from "react"
import * as SecureStore from 'expo-secure-store';
import api from "@/helpers/axios";
import { Alert, ToastAndroid } from "react-native";
import { UserProps } from "@/interfaces/user";

interface IUserLogin {
    email: string
    password: string
}

interface IUserRegister {
    email: string
    password: string
    form: string
    name: string
}

interface IAuthContext {
    isLogged: boolean
    userInfo: UserProps
    user: IUserLogin
    setUser: (user: IUserLogin) => void
    userRegister: IUserRegister
    setUserRegister: (user: IUserRegister) => void
    handleRegister: () => void
    handleLogin: (wAccount?: boolean) => void
    handleLogout: () => void
    handleUpdate: (user: UserProps) => void
    handleChangePass: (oldPass: string, newPass: string) => void
}

interface IAuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [userRegister, setUserRegister] = useState<IUserRegister>({} as IUserRegister);
    const [user, setUser] = useState<IUserLogin>({} as IUserLogin);
    const [data, setData] = useState<UserProps>({} as UserProps);
    const [isLogged, setIsLogged] = useState(false);

    async function handleRegister() {
        if (!userRegister || !userRegister.email || !userRegister.password || !userRegister.form || !userRegister.name)
            return ToastAndroid.showWithGravity('Preencha todos os campos!', ToastAndroid.SHORT, ToastAndroid.TOP);

        await api.post('/auth/registrar',
            { name: userRegister.name, form: userRegister.form, email: userRegister.email, password: userRegister.password })
            .then((res) => {
                if (res.status == 201) {
                    Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
                    router.replace('/');
                    setUserRegister({} as IUserRegister);
                } else {
                    Alert.alert('Erro', 'Falha ao registrar usuário.');
                }
            })
            .catch((e) => {
                if (!e.status) {
                    ToastAndroid.showWithGravity('Problema com o servidor, tente novamente mais tarde', ToastAndroid.SHORT, ToastAndroid.TOP);
                } else {
                    ToastAndroid.showWithGravity(e.response.data.error, ToastAndroid.SHORT, ToastAndroid.TOP);
                }
            });
    }

    const handleLogin = async (wAccount?: boolean) => {
        if (wAccount == true) {
            setData({ ...data, email: 'local', name: 'local', form: 'local' });
            setIsLogged(true);
            router.replace('/main/(tabs)');
            return;
        }

        if (!user || !user.email || !user.password) return ToastAndroid.showWithGravity('Digite suas credenciais!', ToastAndroid.SHORT, ToastAndroid.TOP);

        await api.post('/auth/login', { email: user.email, password: user.password })
            .then(async (res) => {
                ToastAndroid.showWithGravity('Login efetuado com sucesso', ToastAndroid.SHORT, ToastAndroid.TOP);

                setData(res.data.user);
                setUser({} as IUserLogin);
                await SecureStore.setItemAsync('token', res.data.token);

                setIsLogged(true);
                router.replace('/main/(tabs)');
            })
            .catch((err) => {
                if (err.status) {
                    ToastAndroid.showWithGravity(err.response.data.error, ToastAndroid.SHORT, ToastAndroid.TOP);
                } else {
                    ToastAndroid.showWithGravity('Problema com o servidor, tente novamente mais tarde', ToastAndroid.SHORT, ToastAndroid.TOP);
                }
            });
    }

    const handleLogout = async () => {
        if (data.email != 'local') {
            await api.post('/auth/logout', { email: data.email })
                .then((res) => {
                    if (res.status == 200) {
                        setData({} as UserProps);
                        setIsLogged(false);
                        SecureStore.deleteItemAsync('token');

                        router.replace('/');

                        ToastAndroid.showWithGravity(res.data.message, ToastAndroid.SHORT, ToastAndroid.TOP);
                    }
                }).catch((err) => {
                    ToastAndroid.showWithGravity("Erro ao efetuar logout!", ToastAndroid.SHORT, ToastAndroid.TOP);
                });
        }
    }

    const handleUpdate = async (user: UserProps) => {
        if (!user.name && !user.form && !user.email) {
            return ToastAndroid.showWithGravity('Nenhum dos campos pode estar vazio!', ToastAndroid.SHORT, ToastAndroid.TOP);
        }

        if (user.name === data.name && user.form === data.form && user.email === data.email) {
            return ToastAndroid.showWithGravity('Nenhuma alteração foi realizada.', ToastAndroid.SHORT, ToastAndroid.TOP);
        }

        const authorization = await SecureStore.getItemAsync('token');

        await api.put('/auth/updateUser',
            { name: user.name ?? data.name, form: user.form ?? data.form, email: user.email ?? data.email }, { headers: { authorization } })
            .then((res) => {
                if (res.status == 200) {
                    Alert.alert('Sucesso', 'Usuário editado com sucesso!');
                    setUserRegister({} as IUserRegister);
                } else {
                    Alert.alert('Erro', 'Falha ao editar usuário.');
                }
            })
            .catch((e) => {
                if (!e.status) {
                    ToastAndroid.showWithGravity('Problema com o servidor, tente novamente mais tarde', ToastAndroid.SHORT, ToastAndroid.TOP);
                } else {
                    ToastAndroid.showWithGravity(e.response.data.error, ToastAndroid.SHORT, ToastAndroid.TOP);
                }
            });
    }

    const handleChangePass = async (oldPass: string, newPass: string) => {
        if (oldPass && newPass) {
            const authorization = await SecureStore.getItemAsync('token');

            await api.post('/auth/changePass', { oldPass, newPass }, { headers: { authorization } })
                .then((res) => {
                    if (res.status == 200) {
                        ToastAndroid.showWithGravity(res.data.message, ToastAndroid.SHORT, ToastAndroid.TOP);
                    }
                }).catch((err) => {
                    ToastAndroid.showWithGravity(err.response.data.error, ToastAndroid.SHORT, ToastAndroid.TOP);
                });
        }
    }

    return (
        <AuthContext.Provider value={{ userRegister, setUserRegister, user, setUser, handleRegister, handleLogin, handleLogout, handleChangePass, handleUpdate, userInfo: data, isLogged }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}