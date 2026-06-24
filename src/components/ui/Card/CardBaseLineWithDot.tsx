import { View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import ThemedText from '../ThemedText'
import Dot, { DotProps } from '../Dot/Dot'

type Props = PropsWithChildren & {
    label: string
    state: DotProps["state"]
    borderEnabled?: boolean
}
const CardBaseLineWithDot = ({ label, state, borderEnabled = true, children }: Props) => {
    return (
        <View className={`w-full py-3 px-1.5 flex-row justify-between items-center gap-4 ${borderEnabled && "border-t border-gy-gray-200"}`}>
            <View className="flex-row items-center gap-3 pl-2  flex-1 ">
                <Dot state={state} />
                <ThemedText color='gray700' className='text-lg flex-1 font-baloo-medium' numberOfLines={1} ellipsizeMode="tail">{label}</ThemedText>
            </View>


            <View className="flex-row items-center gap-2 shrink-0">
                {children}
            </View>
        </View>
    )
}

export default CardBaseLineWithDot