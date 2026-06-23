import { View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import ThemedText from '../ThemedText'

type Props = PropsWithChildren & {
    label: string
    borderEnabled?: boolean
    className?: string
}
const CardBaseLine = ({ label,children, borderEnabled = true, className }: Props) => {
    return (
        <View className={`w-full py-3 pl-3.5 pr-1.5 flex-row justify-between items-center gap-4 ${borderEnabled && "border-t border-gy-gray-200"} ${className}`}>
            <ThemedText color='gray700' className='text-lg flex-1' numberOfLines={1} ellipsizeMode="tail">{label}</ThemedText>

            <View className="flex-row items-center gap-2 shrink-0">
               {children}
            </View>
        </View>
    )
}

export default CardBaseLine