import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import PhotoBox from "@/components/catalog-record/add-boxes";
import CatalogInputs from "@/components/catalog-record/inputs";
import { ScrollView } from "react-native";
import Camera from "./newImage";
import * as FileSystem from 'expo-file-system'
import { RecordProps } from "@/interfaces";
import { useRecordDatabase } from "@/database/useRecordDatabase";
import StyledConfirmation from "@/components/styled-confirmation";
import { Image } from "@/components/ui/image";
import identifyPlant from "@/helpers/plant";

export default function RegisterSpecie() {
    const [record, setRecord] = useState<RecordProps>({} as RecordProps);
    const [photo, setPhoto] = useState<string[]>([]);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [aiInfo, setAiInfo] = useState<string>('');
    const [aiLoading, setAiLoading] = useState(false);
    const recordDatabase = useRecordDatabase();

    function clearRecord() {
        setRecord({ ...record, comment: '', imageURL: [] });
        setPhoto([]);
    }

    async function handleRegister() {
        if (record && photo && photo.length && record.comment && record.catalog) {
            const updatedPhotos = photo.map((item) => ({ imageURL: item }));

            const updatedRecord: RecordProps = {
                ...record,
                imageURL: updatedPhotos
            }

            await recordDatabase.create(updatedRecord).then(() => {
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

    function handleAddPhoto(photoURL: string) {
        setPhoto((prevPhotos) => [...prevPhotos, photoURL]);
    }

    async function handleCancel() {
        photo.map(async (content) => {
            await FileSystem.deleteAsync(content);
        });

        clearRecord();
    }

    function handleCameraVisible() {
        setCameraVisible(!cameraVisible);
    }

    async function handleAiFunction() {
        if (photo.length === 0) {
            ToastAndroid.showWithGravity('Adicione uma foto para identificação', ToastAndroid.SHORT, ToastAndroid.TOP);
            return;
        }

        setAiLoading(true);

        const imageFecth = await fetch(photo[0]);
        const blob = await imageFecth.blob();

        const file = new File([blob], `plant-${Date.now()}.jpg`);

        identifyPlant([file], photo[0]).then((response) => {
            if (response) {
                console.log("Planta identificada:", response);
            } else {
                ToastAndroid.showWithGravity('Nenhuma planta identificada', ToastAndroid.SHORT, ToastAndroid.TOP);
            }

            console.log("Response:", response);

            // const status = response.status;
            // const data = response.data;

            // switch (status) {
            //     case 200:
            //         if (
            //             data?.results?.length > 0 &&
            //             data.results[0]?.species?.scientificName
            //         ) {
            //             setAiInfo(`✅ Planta identificada: ${data.results[0].species}`);
            //             ToastAndroid.showWithGravity(
            //                 `Planta identificada: ${data.results[0].species.scientificName}`,
            //                 ToastAndroid.SHORT,
            //                 ToastAndroid.TOP
            //             );
            //         } else {
            //             ToastAndroid.showWithGravity(
            //                 'Nenhuma planta identificada.',
            //                 ToastAndroid.SHORT,
            //                 ToastAndroid.TOP
            //             );
            //         }
            //         break;

            //     case 400:
            //         ToastAndroid.showWithGravity('Requisição malformada (400)', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     case 401:
            //         ToastAndroid.showWithGravity('Não autorizado (401)', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     case 404:
            //         ToastAndroid.showWithGravity('Espécie não encontrada', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     case 413:
            //         ToastAndroid.showWithGravity('Imagem muito grande (413)', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     case 414:
            //         ToastAndroid.showWithGravity('URI muito longa (414)', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     case 415:
            //         ToastAndroid.showWithGravity('Tipo de mídia não suportado (415)', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     case 429:
            //         ToastAndroid.showWithGravity('Limite de requisições atingido (429)', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     case 500:
            //         ToastAndroid.showWithGravity('Erro interno no servidor (500)', ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;

            //     default:
            //         ToastAndroid.showWithGravity(`Erro desconhecido (${status})`, ToastAndroid.SHORT, ToastAndroid.TOP);
            //         break;
            // }
        }).catch((error) => {
            if (error.status === 404) {
                ToastAndroid.showWithGravity('Espécie não encontrada', ToastAndroid.SHORT, ToastAndroid.TOP);
            } else {
                console.log("Erro ao identificar planta:", error);
                ToastAndroid.showWithGravity('Erro ao identificar planta', ToastAndroid.SHORT, ToastAndroid.TOP);
            }
        }).finally(() => {
            setAiLoading(false);
        });
    }

    return (
        cameraVisible ?
            <Camera photoIndex={photo.length} setPhotos={handleAddPhoto} onCancel={handleCameraVisible} />

            :

            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <PhotoBox photosURL={photo} setPhotos={setPhoto} onAdd={handleCameraVisible} />
                    <CatalogInputs record={record} setRecord={setRecord} indentifyByAI={handleAiFunction} aiLoading={aiLoading} infoAi={aiInfo} />
                </ScrollView>

                <View style={styles.optionsView}>
                    <StyledConfirmation firClick={handleCancel} firLabel="Limpar" secClick={handleRegister} secLabel="Registrar" />
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
