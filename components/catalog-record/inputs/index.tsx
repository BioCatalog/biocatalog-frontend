import { View, StyleSheet } from "react-native";
import SelectOptionsSpecies from "../select-options-species";
import StyledInput from "@/components/styled-input";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';
import CurrentMaps from "../maps";
import { RecordProps } from "@/interfaces";

interface CatalogInputsProps {
    record: RecordProps
    setRecord: React.Dispatch<React.SetStateAction<RecordProps>>
}

export default function CatalogInputs({ record, setRecord }: CatalogInputsProps) {
    const [date] = useState(new Date().toLocaleString());
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar localização negada');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const local = `{"coords": {"accuracy": ${location.coords.accuracy}, "altitude": ${location.coords.altitude}, "altitudeAccuracy": ${location.coords.altitudeAccuracy},
            "heading": ${location.coords.heading}, "latitude": ${location.coords.latitude}, "longitude": ${location.coords.longitude}, "speed": ${location.coords.speed}},
            "mocked": ${location.mocked}, "timestamp": ${location.timestamp}}`;

            setRecord({ ...record, local, createDate: date });
        })();
    }, [location]);

    function handleChangeOption(value: string) {
        setRecord({ ...record, catalog: value });
    }

    return (
        <View style={styles.container}>
            <SelectOptionsSpecies onChange={handleChangeOption} />
            <StyledInput placeholder="Faça um comentário" type="text-area" label="Comentário" onChangeText={(value) => { setRecord({ ...record, comment: value }) }} />
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
    }
});