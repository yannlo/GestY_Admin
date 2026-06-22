import { View } from 'react-native'
import React from 'react'
import BottomSheetBase from './BottomSheetBase';

type Props = {
    searchText: string,
    onChangeSearchText: (text: string) => void
    visible: boolean;
    onClose: () => void;
}
const SearchBottomSheet = ({ searchText: _searchText, onChangeSearchText: _onChangeSearchText, visible, onClose }: Props) => {
    return (
        <BottomSheetBase visible={visible} bgVisible={false} onClose={onClose}>
            <View className="py-8">
        
            </View>
        </BottomSheetBase>
    )
}

export default SearchBottomSheet