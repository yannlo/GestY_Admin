import { View } from 'react-native'
import { PropsWithChildren } from 'react'
import ThemedText from '@/components/ui/ThemedText'

interface MenuProps extends PropsWithChildren {
    title?: string
}
export function Menu({ title, children }: MenuProps) {
    return (
        <View className="w-full mb-8">
            {title && <View className="px-8 mb-2">
                <ThemedText format="strong" color="gray600">{title}</ThemedText>
            </View>}
            <View className="w-full gap-0">
                {children}
            </View>

        </View>
    )
}