import { View } from 'react-native'
import { PropsWithChildren } from 'react'
import ThemedText from '@/components/ui/ThemedText'

interface InputGroupProps extends PropsWithChildren {
    title?: string
}
export default function InputGroup({ title, children }: InputGroupProps) {
    return (
        <View className="w-full mb-8 px-4 ">
            {title && <View className="mb-4">
                <ThemedText format="strong" className='text-base' color="gray600">{title}</ThemedText>
            </View>}
            <View className="w-full gap-4">
                {children}
            </View>

        </View>
    )
}
