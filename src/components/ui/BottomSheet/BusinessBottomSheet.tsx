import { PressableProps, View } from 'react-native'
import React from 'react'
import BottomSheetBase from './BottomSheetBase';
import { Button } from '../Button';
import ThemedText from '../ThemedText';
import Dot from '../Dot/Dot';
import Badge from '../Badge';
import Icon from '../Icon';
import DotStatic from '../Dot/DotStatic';
import { defineDotState } from '@/utils/dot';

type Props = {
    business: Business,
    visible: boolean;
    onClose: () => void;
    onPress: PressableProps['onPress']
}
const BUSSINESS_ACCOUNT_LIMIT = process.env.EXPO_PUBLIC_BUSSINESS_ACCOUNT_LIMIT || 2 as number

const ACTIVITY_ICONS: { key: ActivityValue; icon: string }[] = [
    { key: "retail", icon: "shoppingBag" },
    { key: "wholesale", icon: "Package_2" },
    { key: "transfer", icon: "simCard" },
];

const BusinessBottomSheet = ({ business, visible, onClose, onPress }: Props) => {
    return (

        <BottomSheetBase visible={visible} bgVisible={false} onClose={onClose}>
            <View className='px-4 pt-6 gap-6'>
                <View className='items-center gap-2'>
                    <View className=' justify-center items-center gap-3 flex-row'>
                        <Dot state={defineDotState(business.status)} />
                        <ThemedText format="profileBusiness">{business.name}</ThemedText>
                    </View>
                    <View className='flex-row gap-3'>
                        {business.categories.map((cat) => {
                            return (
                                <Badge label={cat.name} key={cat.id} />
                            )
                        })}
                    </View>
                </View>

                <View className='gap-2'>
                    <BusinessBottomSheetItem label='Comptes enregistrés' >
                        <ThemedText color='gray500' format="bottomSheetLabelLite">(max {BUSSINESS_ACCOUNT_LIMIT})</ThemedText>
                        <ThemedText format="bottomSheetLabel" className='ml-1 mr-2'>{business.accountNumber.total}</ThemedText>
                    </BusinessBottomSheetItem>
                    <BusinessBottomSheetItem label="Types d'activités" >
                        {ACTIVITY_ICONS.filter((activity) => business.activities[activity.key]).map((activity, index) => (
                            <React.Fragment key={activity.key}>
                                {index > 0 && <DotStatic className='size-2! bg-gy-gray-600' />}
                                <Icon name={activity.icon} className='size-7 text-gy-gray-600' />
                            </React.Fragment>
                        ))}
                    </BusinessBottomSheetItem>
                </View>


            </View>
            <View className="mt-12 pb-8">
                <Button variant='outline' title="Voir plus" onPress={onPress} />
            </View>
        </BottomSheetBase >
    )
}

export default BusinessBottomSheet


type BusinessBottomSheetItemProps = {
    label: string
    children: React.ReactNode
}

const BusinessBottomSheetItem = ({ label, children }: BusinessBottomSheetItemProps) => {
    return (
        <View className="flex-row justify-between items-center">
            <ThemedText color='gray800' format="bottomSheetLabel">{label}</ThemedText>
            <View className='items-center flex-row gap-1.5'>
                {children}
            </View>

        </View>
    )
}
