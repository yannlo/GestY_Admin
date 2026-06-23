import { View, Text } from 'react-native'
import React, { PropsWithChildren } from 'react'

export default function CardBodyLayout({ children }: PropsWithChildren) {
    return (
        <View className="px-5">
            {children}
         </View>
    )
}