import { View, Text, Pressable, PressableProps } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'
import Icon from './Icon'

type Props = {
    label: string
    icon?: string
}

const Badge = ({ label, icon }: Props) => {
    return (
        <View
            className=" bg-gy-white rounded-full border border-gy-gray-500 px-2 py-0.5 flex-row items-center justify-center gap-1.5 active:opacity-70"
        >
            {icon && <Icon name={icon} className="text-gy-gray-700 size-6" />}
            <ThemedText color="gray700" >{label}</ThemedText>
        </View>
    )
}

export default Badge