import { View, Pressable, PressableProps } from 'react-native'
import { PropsWithChildren, useState } from 'react'
import ThemedText from '@/components/ui/ThemedText'
import { useRouter, type LinkProps } from 'expo-router'
import Icon from '@/components/ui/Icon'
import Toggle from '@/components/ui/Toggle'

interface InputGroupProps extends PropsWithChildren {
    title?: string
}
export default function InputGroup({ title, children }: InputGroupProps) {
    return (
        <View className="w-full mb-8 px-4 ">
            {title && <View className="mb-4">
                <ThemedText format="strong" color="gray600">{title}</ThemedText>
            </View>}
            <View className="w-full gap-4">
                {children}
            </View>

        </View>
    )
}
