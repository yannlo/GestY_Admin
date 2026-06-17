import { View, Pressable } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';
import ThemedText from './ThemedText'
import { useAuth } from '@/hooks/useAuth'

const profile = tv({
    base: 'bg-gy-primary-400 justify-center items-center rounded-full',
    variants: {
        size: {
            md: 'size-14',
            lg: 'size-24 pt-1',
        }
    },
});

const textFormatMap = {
    md: 'profile',
    lg: 'profileLg',
} as const;

interface ProfileProps extends VariantProps<typeof profile> {
    onPress?: () => void;
}

export default function Profile({ size = 'md', onPress }: ProfileProps) {
    const { user } = useAuth();


    if (onPress) {
        return (
            <Pressable onPress={onPress} className={profile({ size, class: 'hover:bg-gy-primary-200 active:bg-gy-primary-200' })}>
                <ThemedText format={textFormatMap[size as keyof typeof textFormatMap]} color='white'>
                    {user?.lastname[0]}
                </ThemedText>
            </Pressable>
        );
    }

    return <View className={profile({ size })}>
        <ThemedText format={textFormatMap[size as keyof typeof textFormatMap]} color='white'>
            {user?.lastname[0]}
        </ThemedText>
    </View>;
}