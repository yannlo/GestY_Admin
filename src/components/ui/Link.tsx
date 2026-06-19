import { Pressable } from 'react-native'
import { PropsWithChildren } from 'react'
import ThemedText, { themedText } from './ThemedText'
import { LinkProps, useRouter } from 'expo-router'
import { VariantProps } from 'tailwind-variants'

type Props = PropsWithChildren & {
    href?: LinkProps["href"]
    onPress?: () => {}
    color?: VariantProps<typeof themedText>["color"];
    className?: string
}
export default function ({ href, onPress, color, className, children }: Props) {

    const router = useRouter()
    const handlePress = () => {
        if(href) {
            router.push(href)
            return
        }
        if(onPress) {
            onPress()
        }
    }

    return (
        <Pressable onPress={handlePress} className={` active:opacity-50 ${className ?? ""}`}>
            <ThemedText format="link" color={color}>{children}</ThemedText>
        </Pressable>
    )
}
