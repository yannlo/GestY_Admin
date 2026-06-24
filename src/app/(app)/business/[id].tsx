import "@/app/global.css"
import { ScrollView, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getBusiness } from "@/services/businessApi";
import LoadingScreen from "@/components/layouts/LoadingScreen";
import Dot from "@/components/ui/Dot/Dot";
import { defineDotState } from "@/utils/dot";
import { useEffect } from "react";
import { STATUSES } from "@/constants/Enum";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import AccountNumberCard from "@/components/ui/Card/Business/AccountNumberCard";
import CardGroup from "@/components/layouts/CardGroup";
import ProductStateCard from "@/components/ui/Card/Business/ProductStateCard";
import TransferStateCard from "@/components/ui/Card/Business/TransferStateCard";
import OptionCard from "@/components/ui/Card/Business/OptionCard";

const MAX_BUSINESS_ACCOUNT: Business['accountNumber'] = {
  total: Number(process.env.EXPO_PUBLIC_BUSSINESS_ACCOUNT_LIMIT ?? 10),
  owner: Number(process.env.EXPO_PUBLIC_BUSSINESS_ACCOUNT_OWNER_LIMIT ?? 2),
  manager: Number(process.env.EXPO_PUBLIC_BUSSINESS_ACCOUNT_MANAGER_LIMIT ?? 3),
  seller: Number(process.env.EXPO_PUBLIC_BUSSINESS_ACCOUNT_SELLER_LIMIT ?? 5),
}

export default function () {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const businessId = Array.isArray(id) ? id[0] : id;

  const { data: business, isLoading } = useQuery({
    queryKey: ["business", businessId],
    queryFn: () => getBusiness(businessId as string),
    enabled: !!businessId,
  });

  useEffect(() => {
    if (business === null) {
      // TODO: rediriger vers not found
    }
  }, [business])

  if (!business) {
    return <View className="flex-1 bg-gy-gray-50" >
      <LoadingScreen isLoading={isLoading} />
    </View >;
  }

  return (
    <View className="flex-1 bg-gy-gray-50 pb-safe">
      <ScrollView className="flex-1"
        contentContainerClassName="py-16 px-4">
        <View className="gap-4 items-center mb-12">
          <View className=' justify-center items-center gap-2 flex-row'>
            <Dot state={defineDotState(business.status)} />
            <ThemedText format="strong" className="text-xl">{STATUSES.find(({ value }) => value === business.status)?.label}</ThemedText>
          </View>
          <ThemedText format="profileBusiness">{business.name}</ThemedText>
          <View className='flex-row gap-3 mb-2'>
            {business.categories.map((cat) => {
              return (
                <Badge label={cat.name} key={cat.id} />
              )
            })}
          </View>
          <Button
            iconLeft="locationOn"
            variant="outline"
            title="voir la localisation"
            onPress={() => {
              router.push({ pathname: '/', params: { businessId: businessId } })
            }} />
        </View>

        <View className="flex-1 gap-8" >
          <CardGroup title="Générales">
            <AccountNumberCard
              accountNumber={business.accountNumber}
              maxManager={MAX_BUSINESS_ACCOUNT.manager}
              maxOwner={MAX_BUSINESS_ACCOUNT.owner}
              maxSeller={MAX_BUSINESS_ACCOUNT.seller}
              maxTotal={MAX_BUSINESS_ACCOUNT.total}
            />
          </CardGroup>

          <CardGroup title="Types d'activités">
            <ProductStateCard activity={{
              label: "En détail",
              state: business.status == "active" && business.activities.retail ? "active" : (business.status == "active" ? "suspended" : "inactive"),
              icon: "shoppingBag"
            }}
              productStats={business.productStat.retail} />
            <ProductStateCard activity={{
              label: "En gros",
              state: business.status == "active" && business.activities.wholesale ? "active" : (business.status == "active" ? "suspended" : "inactive"),
              icon: "Package_2"
            }}
              productStats={business.productStat.wholesale} />
             <TransferStateCard activity={{
              label: "Transfert",
              state: business.status == "active" && business.activities.transfer ? "active" : (business.status == "active" ? "suspended" : "inactive"),
              icon: "simCard"
            }}
              stats={business.transferStat} />
          </CardGroup>

          <CardGroup title="Liste des options">
            <OptionCard options={business.options} />
          </CardGroup>

        </View>

      </ScrollView>
    </View>
  );
}
