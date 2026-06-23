import { View, Text } from 'react-native'
import React, { PropsWithChildren } from 'react'
import ThemedText from '../ThemedText'

type Props = PropsWithChildren & {
    label: string
}
const CardSubitleLine = ({ label,children }: Props) => {
    return (
        <View className="w-full py-3 px-1 flex-row justify-between items-center gap-4">
            <ThemedText format="strong" color='gray700' className='text-lg'>{label}</ThemedText>
            
            <View className="flex-row items-center gap-2">
               {children}
            </View>
        </View>
    )
}

export default CardSubitleLine