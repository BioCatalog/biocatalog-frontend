import { StyleSheet } from "react-native";
import { Input, InputField } from "../ui/input";
import { VStack } from "../ui/vstack";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { ChevronDownIcon } from "../ui/icon";
import { Textarea, TextareaInput } from "../ui/textarea";
import StyledFormControl from "../styled-form-control";

interface StyledInputProps {
    label?: string
    placeholder?: string
    onChangeText?: (text: string) => void
    onClick?: () => void
    type: 'text' | 'password' | 'select-options' | 'text-area'
    options?: Array<{ name: string, id: string }>
    value?: string
    defaultValue?: string
    isRead?: boolean
    helper?: string
}

export default function StyledInput({ label, helper, placeholder, type, options, onChangeText, onClick, value, defaultValue, isRead }: StyledInputProps) {
    return (
        <VStack space="xs">
            <StyledFormControl label={label} helper={helper}>
                {
                    ['text', 'password'].includes(type) ?

                        <Input isReadOnly={isRead} style={[styles.input]}>
                            <InputField
                                type={(type == 'text' || type == 'password') ? type : 'text'}
                                placeholder={placeholder}
                                defaultValue={defaultValue ?? defaultValue}
                                onChangeText={onChangeText} />
                        </Input>

                        :

                        type == 'select-options' ?
                            <Select onValueChange={onChangeText} onOpen={onClick}>
                                <SelectTrigger style={{ height: 'auto' }}>
                                    <SelectInput placeholder={placeholder} className="flex-1" defaultValue={value} />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {
                                            options?.map((option) => (
                                                <SelectItem key={option.id} label={option.name} value={option.id} />
                                            ))
                                        }
                                    </SelectContent>
                                </SelectPortal>
                            </Select>

                            :

                            <Textarea size="md">
                                <TextareaInput defaultValue={defaultValue} value={value} onChangeText={onChangeText} placeholder={placeholder} />
                            </Textarea>
                }
            </StyledFormControl>
        </VStack>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 6
    },
})