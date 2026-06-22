import { View, Pressable, PressableProps } from 'react-native'
import ThemedText from '@/components/ui/ThemedText'
import { useRouter, type LinkProps } from 'expo-router'
import Icon from '@/components/ui/Icon'
import Toggle from '@/components/ui/Toggle'


interface MenuItemProps {
    title: string
    href?: LinkProps['href']
    onPress?: PressableProps['onPress']
    icon?: string
}


export function MenuItem({ title, icon, href, onPress }: MenuItemProps) {
    const router = useRouter();
    return (
        <Pressable className="w-full active:bg-gy-gray-200" onPress={onPress || (href ? () => router.push(href as any) : undefined)}>
            <View className="px-8 py-3 w-full flex-row items-center gap-4">
                {icon && <Icon name={icon} className="text-gy-black size-8" />}
                <ThemedText format="menu" color="black">{title}</ThemedText>
            </View>
        </Pressable>
    );
}


interface MenuItemToggleProps extends Omit<MenuItemProps, 'icon'> {
    isToggled: boolean
    isToggleDisabled?: boolean
}

export function MenuItemToggle({ title, href, onPress, isToggled, isToggleDisabled }: MenuItemToggleProps) {
    const router = useRouter();
    const handleChange: PressableProps["onPress"] = (...params) => {
        if (isToggleDisabled) return;
        if (onPress) {
            onPress(...params)
            return;
        }
        if (href) {
            router.push(href)
        }
    }

    return (
        <Pressable className="w-full active:bg-gy-gray-200" onPress={handleChange}>
            <View className="px-8 py-3 w-full flex-row items-center gap-4">
                <Toggle active={isToggled} disabled={isToggleDisabled} onPress={handleChange} />
                <ThemedText format="menu" color="black">{title}</ThemedText>
            </View>
        </Pressable>
    );
}

interface MenuItemStatusProps extends MenuItemProps {
    enabled: boolean
}

export function MenuItemStatus({ title, href, onPress, enabled }: MenuItemStatusProps) {
    const router = useRouter();
    return (
        <Pressable className="w-full active:bg-gy-gray-200" onPress={onPress || (href ? () => router.push(href as any) : undefined)}>
            <View className="px-8 py-3 w-full flex-row justify-between items-center gap-4">
                <ThemedText format="menu" color="black">{title}</ThemedText>
                {enabled && <Icon name="check-circle" className="text-gy-black size-8" />}
            </View>
        </Pressable>
    );
}