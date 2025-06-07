import { View, StyleSheet } from "react-native";
import SelectOptionsSpecies from "../select-options-species";
import StyledInput from "@/components/styled-input";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';
import CurrentMaps from "../maps";
import { RecordProps } from "@/interfaces";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Sparkle } from 'lucide-react-native';
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface CatalogInputsProps {
    record: RecordProps
    setRecord: React.Dispatch<React.SetStateAction<RecordProps>>
    indentifyByAI: () => void;
    infoAi?: string;
    aiLoading?: boolean;
}

export default function CatalogInputs({ record, setRecord, indentifyByAI, infoAi, aiLoading }: CatalogInputsProps) {
    const [date] = useState(new Date().toLocaleString());
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [errorMsg, setErrorMsg] = useState('');

    async function getLocationAsync() {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Permissão para acessar localização negada');
            return;
        }

        const currentLocation = await Location.getLastKnownPositionAsync({});
        setLocation(currentLocation);

        if (currentLocation) {
            const local = `{"coords": {"accuracy": ${currentLocation.coords.accuracy}, "altitude": ${currentLocation.coords.altitude}, "altitudeAccuracy": ${currentLocation.coords.altitudeAccuracy},
            "heading": ${currentLocation.coords.heading}, "latitude": ${currentLocation.coords.latitude}, "longitude": ${currentLocation.coords.longitude}, "speed": ${currentLocation.coords.speed}},
            "mocked": ${currentLocation.mocked}, "timestamp": ${currentLocation.timestamp}}`;

            setRecord({ ...record, local, createDate: date });
        }
    }

    useEffect(() => {
        getLocationAsync();
    }, []);

    function handleChangeOption(value: string) {
        setRecord({ ...record, catalog: value });
    }

    return (
        errorMsg ?
            <>
                {errorMsg}
            </>

            :

            <View style={styles.container}>
                <View style={styles.aiContainer}>
                    <Button size="lg" action="positive" onPress={indentifyByAI} isDisabled={aiLoading}>
                        {
                            aiLoading &&
                            <ButtonSpinner />
                        }
                        <ButtonIcon size="lg" as={Sparkle} />
                        <ButtonText>
                            Identificar com IA
                        </ButtonText>
                    </Button>

                    {
                        infoAi &&

                        <Card size="md" variant="elevated" className="m-3">
                            <Heading size="md">
                                Informações
                            </Heading>
                            <Text size="md">

                            </Text>
                        </Card>
                    }
                </View>

                <SelectOptionsSpecies onChange={handleChangeOption} value={record.catalog} />
                <StyledInput
                    placeholder="Faça um comentário"
                    type="text-area" label="Comentário"
                    value={record.comment}
                    onChangeText={(value) => { setRecord({ ...record, comment: value }) }} />
                <StyledInput
                    isRead={true}
                    defaultValue={date}
                    type="text"
                    label="Data e hora" />
                {
                    location &&
                    <CurrentMaps location={location} />
                }
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        rowGap: 15,
        marginBottom: 30
    },

    aiContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20
    }
});