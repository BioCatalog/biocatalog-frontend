import { router } from "expo-router";
import { useState, useEffect } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import PhotoBox from "@/components/catalog-record/add-boxes";
import CatalogInputs from "@/components/catalog-record/inputs";
import { ScrollView } from "react-native";
import Camera from "./newImage";
import * as FileSystem from 'expo-file-system'
import { RecordProps } from "@/interfaces";
import { useRecordDatabase } from "@/database/useRecordDatabase";
import StyledConfirmation from "@/components/styled-confirmation";

export default function RegisterSpecie() {
    const [record, setRecord] = useState<RecordProps>({} as RecordProps);
    const [photo, setPhoto] = useState<string[]>([]);
    const [cameraVisible, setCameraVisible] = useState(false);
    const recordDatabase = useRecordDatabase();

    function clearRecord() {
        setRecord({} as RecordProps);
    }

    async function handleRegister() {
        if (record && record.imageURL && record.imageURL.length && record.comment && record.catalog) {
            await recordDatabase.create(record).then(() => {
                ToastAndroid.showWithGravity('Evidencia registrada!', ToastAndroid.SHORT, ToastAndroid.TOP);
                router.replace('/main/(tabs)/catalog');
            }).catch((e) => {
                console.log(e);
                ToastAndroid.showWithGravity('Não foi possível registrar' + e, ToastAndroid.SHORT, ToastAndroid.TOP);
            }).finally(() => {
                clearRecord();
            });
        } else {
            ToastAndroid.showWithGravity('Preencha todos os campos!', ToastAndroid.SHORT, ToastAndroid.TOP);
        }
    }

    async function handleCancel() {
        photo.map(async (content) => {
            await FileSystem.deleteAsync(content);
        });

        clearRecord();
        router.replace('/main/(tabs)');
    }

    async function handleCameraVisible() {
        setCameraVisible(!cameraVisible);
    }

    useEffect(() => {
        setRecord({ ...record, imageURL: photo.map((item) => ({ imageURL: item })) });
    }, [photo, setPhoto]);

    return (
        cameraVisible ?
            <Camera photoIndex={photo.length} setPhotos={setPhoto} onCancel={handleCameraVisible} />

            :

            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <PhotoBox photosURL={photo} setPhotos={setPhoto} onAdd={handleCameraVisible} />
                    <CatalogInputs record={record} setRecord={setRecord} />
                </ScrollView>

                <View style={styles.optionsView}>
                    <StyledConfirmation firClick={handleCancel} firLabel="Cancelar" secClick={handleRegister} secLabel="Registrar" />
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    buttonBack: {
        width: 100
    },

    optionsView: {
        position: 'absolute',
        width: '100%',
        bottom: 20,
    },

    scrollView: {
        flex: 1,
        padding: 15
    }
});
