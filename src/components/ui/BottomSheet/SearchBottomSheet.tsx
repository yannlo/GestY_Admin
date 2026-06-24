import { View, Pressable } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import BottomSheetBase from './BottomSheetBase';
import { SearchInput } from '../Input';
import ThemedText from '../ThemedText';
import Dot from '../Dot/Dot';
import DotStatic from '../Dot/DotStatic';
import Icon from '../Icon';
import { ACTIVITY_ICONS } from '@/constants/icons';
import { ACTIVITIES } from '@/constants/Enum';
import { useBottomSheetActions } from '@/hooks/useBottomSheet';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { defineDotState } from '@/utils/dot';

type Props = {
    visible: boolean;
    onClose: () => void;
    businesses: Business[];
    onSelect?: (business: Business) => void;
    search: string;
    setSearch: (text: string) => void;
}

const activityLabels = Object.fromEntries(
    ACTIVITIES.map(({ value, label }) => [value, label])
);

type SearchBarProps = {
    search: string;
    setSearch: (text: string) => void;
    totalLabel: string;
};

const SearchBar = ({ search, setSearch, totalLabel }: SearchBarProps) => {
    return (
        <View className="p-4 gap-4 items-center border-b border-gy-gray-200">
            <SearchInput
                placeholder="Rechercher…"
                value={search}
                onChangeText={(text: string) => setSearch(text)}
            />
            <ThemedText color="gray600">{totalLabel}</ThemedText>
        </View>
    );
};

type ResultRowProps = {
    name: string;
    dotState: ReturnType<typeof defineDotState>;
    activities: Business['activities'];
    onPress?: () => void;
};

const ResultRow = ({ name, dotState, activities, onPress }: ResultRowProps) => {
    const activeIcons = useMemo(
        () => ACTIVITY_ICONS.filter((activity) => activities[activity.key]),
        [activities]
    );

    const content = (
        <View className="w-full px-4 py-3 gap-2 border-b border-gy-gray-200">
            <View className="flex-row items-center gap-3 pl-2">
                <Dot state={dotState} />
                <ThemedText color="gray700" className="text-xl font-baloo-semibold">{name}</ThemedText>
            </View>
            <View className="flex-row flex-wrap gap-2.5 ml-2 items-center justify-start">
                {activeIcons.map((activity, index) => (
                    <React.Fragment key={activity.key}>
                        {index > 0 && <DotStatic className="size-2! bg-gy-gray-600" />}
                        <View className="flex-row justify-center gap-1">
                            <Icon name={activity.icon} className="size-7 text-gy-gray-600" />
                            <ThemedText color="gray700" className="text-lg font-baloo-medium">
                                {activityLabels[activity.key]}
                            </ThemedText>
                        </View>
                    </React.Fragment>
                ))}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <Pressable className="active:bg-gy-primary-100" onPress={onPress}>
                {content}
            </Pressable>
        );
    }
    return content;
};

function SearchBottomSheet({ visible, onClose, businesses, onSelect, search, setSearch }: Props) {
    const { expand } = useBottomSheetActions();
    const isKeyboardVisibled = useKeyboardVisible();

    useEffect(() => {
        if (isKeyboardVisibled) {
            expand();
        }
    }, [isKeyboardVisibled, expand]);

    const normalizedSearch = search.trim().toLowerCase();
    const totalLabel = `${businesses.length} entreprise${businesses.length > 1 ? 's' : ''} ${normalizedSearch ? 'trouvée' : 'enregistrée'}${businesses.length > 1 ? 's' : ''}`;

    return (
        <BottomSheetBase
            visible={visible}
            bgVisible={false}
            onClose={onClose}
            header={<SearchBar search={search} setSearch={setSearch} totalLabel={totalLabel} />}
        >
            <View className="flex-1">
                {businesses.length === 0 ? (
                    <View className="p-6 items-center">
                        <ThemedText color="gray500">Aucune entreprise trouvée</ThemedText>
                    </View>
                ) : (
                    businesses.map((business) => (
                        <ResultRow
                            key={business.id}
                            name={business.name}
                            dotState={defineDotState(business.status)}
                            activities={business.activities}
                            onPress={() => onSelect?.(business)}
                        />
                    ))
                )}
            </View>
        </BottomSheetBase>
    );
}

export default React.memo(SearchBottomSheet);