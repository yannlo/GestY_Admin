import { View } from 'react-native'
import { PropsWithChildren } from 'react'
import ThemedText from '@/components/ui/ThemedText'

interface InputGroupProps extends PropsWithChildren {
    title?: string
}
export default function InputGroup({ title, children }: InputGroupProps) {
    return (
        <View className="w-full flex-1">
            {title && <View className="mb-2 ml-6">
                <ThemedText format="strong" className='text-base' color="gray600">{title}</ThemedText>
            </View>}
            <View className="w-full gap-4">
                {children}
            </View>

        </View>
    )
}
