import { View, Pressable, PressableProps } from 'react-native'
import { PropsWithChildren, useState } from 'react'
import ThemedText from '@/components/ui/ThemedText'
import { useRouter, type LinkProps } from 'expo-router'
import Icon from '@/components/ui/Icon'
import Toggle from '@/components/ui/Toggle'

interface SettingsMenuProps extends PropsWithChildren {
    title?: string
}
export function SettingsMenu({ title, children }: SettingsMenuProps) {
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

interface SettingsMenuLineProps {
    title: string
    href?: LinkProps['href']
    onPress?: PressableProps['onPress']
    icon?: string
}

export function SettingsMenuLine({ title, icon, href, onPress }: SettingsMenuLineProps) {
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


interface SettingsMenuLineToggleProps extends SettingsMenuLineProps {
    isToggled: boolean
    isToggleDisabled?: boolean
}

export function SettingsMenuLineToggle({ title, href, onPress, isToggled, isToggleDisabled }: SettingsMenuLineToggleProps) {
    const router = useRouter();

    return (
        <Pressable className="w-full active:bg-gy-gray-200" onPress={onPress || (href ? () => router.push(href as any) : undefined)}>
            <View className="px-8 py-3 w-full flex-row items-center gap-4">
                <Toggle active={isToggled} disabled={isToggleDisabled} onPress={() => {}} />
                <ThemedText format="menu" color="black">{title}</ThemedText>
            </View>
        </Pressable>
    );
}

interface SettingsMenuLineStatusProps extends SettingsMenuLineProps {
    enabled: boolean
}

export function SettingsMenuLineStatus({ title, href, onPress, enabled }: SettingsMenuLineStatusProps) {
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