import { View, Text } from 'react-native'
import React, { PropsWithChildren } from 'react'

export default function CardLayout({ children }: PropsWithChildren) {
    return (
        <View className="bg-gy-white border border-gy-gray-200 rounded-2xl">
            {children}
         </View>
    )
}