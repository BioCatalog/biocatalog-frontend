import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as FileSystem from 'expo-file-system'
import StyledButton from "@/components/styled-button";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@/components/ui/slider";
interface CameraProps {
    onCancel: () => void
    setPhotos: (photoURL: string) => void //React.Dispatch<React.SetStateAction<string[]>>
    photoIndex: number
}

export default function Camera({ onCancel, setPhotos, photoIndex }: CameraProps) {
    const [perm, reqPerm] = useCameraPermissions();
    const [tempPhoto, setTempPhoto] = useState('');
    const [load, setLoad] = useState(false);
    const [zoom, setZoom] = useState(0);

    const date = new Date();

    let camera: CameraView | null;

    const takePicture = async () => {
        if (perm) {
            setLoad(true);
            await camera?.takePictureAsync()
                .then((res) => {
                    if (res?.uri) {
                        setTempPhoto(res.uri);
                    }
                })
                .catch((e) => {
                    alert(e);
                }).finally(() => {
                    setLoad(false);
                });

        } else {
            alert('Sem permissão');
        }
    }

    const savePicture = async () => {
        const photoFileName = FileSystem.documentDirectory + `${date.getTime()}.jpg`;

        await FileSystem.deleteAsync(photoFileName, { idempotent: true });

        await FileSystem.copyAsync({
            from: tempPhoto,
            to: photoFileName
        }).then(async () => {
            // setPhotos((photos) => [...photos, photoFileName]);
            setPhotos(photoFileName);
            onCancel();
        });
    }

    const retakePicture = async () => {
        await FileSystem.deleteAsync(tempPhoto);
        setTempPhoto('');
    }

    if (!perm) return <></>

    return (
        <View style={styles.container}>
            {
                tempPhoto ?
                    <>
                        <Image source={{ uri: tempPhoto }} style={styles.photo} />
                        <View style={styles.buttonPhoto}>
                            <StyledButton text="Descartar" color='blue' onClick={retakePicture} />
                            <StyledButton text="Salvar" color="green" onClick={savePicture} />
                        </View>
                    </>
                    :
                    <CameraView
                        zoom={(zoom / 100)}
                        facing="back"
                        ref={(ref) => { camera = ref }}
                        style={styles.camera}>
                        <View style={{ flexGrow: 1, width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <View style={{ height: '50%', paddingRight: 30 }}>
                                <Slider
                                    onChange={setZoom}
                                    orientation="vertical"
                                    minValue={0}
                                    maxValue={100}
                                    style={{ height: '100%', padding: 20 }}>
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb style={{ height: 20, width: 20, margin: 20 }} />
                                </Slider>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button}>
                                <StyledButton load={load} text="Cancelar" color="red" onClick={onCancel} />
                                <StyledButton load={load} text="Tirar foto" onClick={takePicture} />
                            </TouchableOpacity>
                        </View>
                    </CameraView>
            }

        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey'
    },
    photo: {
        height: '80%',
        width: '80%'
    },
    camera: {
        flex: 1,
        width: '100%'
    },
    buttonContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 10,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonPhoto: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20,
    }
})