import { View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import ThemedText from '../ThemedText'
import Icon from '../Icon'

type Props = PropsWithChildren & {
    label: string
    icon: string
    borderEnabled?: boolean
}
const CardTitleLine = ({ label, icon, children, borderEnabled = true }: Props) => {
    return (
        <View className={`w-full py-3 px-6 flex-row justify-between items-center gap-4 ${borderEnabled ? 'border-b border-gy-gray-200' : ''}`}>

            <View className="flex-row items-center gap-2">
            <Icon name={icon} className='size-7 text-gy-gray-700' />
            <ThemedText format="strong" color='gray700' className='text-xl'>{label}</ThemedText>
            </View>
            <View className="flex-row items-center gap-2">
               {children}
            </View>
        </View>
    )
}

export default CardTitleLine