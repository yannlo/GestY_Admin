import { View, Text, Pressable, PressableProps } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'
import Icon from './Icon'

type Props = {
    onPress?: PressableProps["onPress"]
    label: string
    icon?: string
}

const Tag = ({label, onPress, icon}:Props) => {
    return (
        <Pressable
            onPress={onPress}
            className="bg-gy-primary-200 rounded-sm px-2 py-0.5 flex-row items-center justify-center gap-1.5 active:opacity-70"
        >
            {icon && <Icon name={icon} className="text-gy-gray-900 size-6" /> }
            <ThemedText color="gray900" >{label}</ThemedText>
            <Icon name="close" className="text-gy-gray-600 size-5" />
        </Pressable>
    )
}

export default Tag