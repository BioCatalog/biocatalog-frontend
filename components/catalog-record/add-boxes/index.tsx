import { Button, ButtonIcon } from "@/components/ui/button"
import { Icon, TrashIcon } from "@/components/ui/icon";
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { ScrollView, View, StyleSheet, Image } from "react-native"
import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system'
import { Dispatch, SetStateAction } from "react";

interface PhotoBoxProps {
    photosURL: string[]
    onAdd: () => void
    setPhotos: Dispatch<SetStateAction<string[]>>
}

export default function PhotoBox({ photosURL, onAdd, setPhotos }: PhotoBoxProps) {
    async function erasePhoto(url: string) {
        const file = await FileSystem.deleteAsync(url, { idempotent: true })
            .then(() => {
                const newPhotos = photosURL.filter((item) => item !== url);
                setPhotos(newPhotos);
            })
            .catch((e) => console.log('Não foi possível deletar, erro: ' + e));
    }

    return (
        <ScrollView
            nestedScrollEnabled
            style={style.scrollView}
            contentContainerStyle={style.imagesView}>
            <Button style={style.box} onPress={onAdd}>
                <FontAwesome size={50} name="plus-square" />
            </Button>

            {
                photosURL && photosURL.map((photoUrl, index) => (
                    <View key={index} style={style.box}>
                        <Button
                            onPress={() => { erasePhoto(photoUrl) }}
                            style={{ zIndex: 1, alignSelf: 'flex-end', borderRadius: 5, aspectRatio: 1, backgroundColor: 'red', position: 'absolute' }}>
                            <ButtonIcon>
                                <Icon as={TrashIcon}
                                    size={'lg'}
                                    color="black" />
                            </ButtonIcon>
                        </Button>
                        <Image source={{ uri: photoUrl }} style={style.image} />
                    </View>
                ))
            }
        </ScrollView>
    )
}

const screenHeight = Dimensions.get('window').height;

const style = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },

    box: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#65db4d',
        borderRadius: 10,
        marginBottom: 10
    },

    imagesView: {
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: 'space-between',
        padding: 10
    },

    scrollView: {
        height: screenHeight / 2,
        position: 'relative',
        backgroundColor: 'gray',
        borderRadius: 15,
    }
})