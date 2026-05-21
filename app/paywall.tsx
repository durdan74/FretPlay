import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { PACKAGE_TYPE, type PurchasesPackage } from 'react-native-purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePurchases } from '@/contexts/purchases-context';
import { useNotation } from '@/contexts/notation-context';
import { fetchCurrentPackages } from '@/lib/purchases/offerings';
import { fillTemplate } from '@/lib/i18n/template';
import { loadGameHistory } from '@/storage/gameHistory';
import { markLocallyUnlocked } from '@/storage/paywallAccess';

type PlanType = 'annual' | 'monthly';

function formatLocalizedPrice(amount: number, pkg: PurchasesPackage): string {
  const currencyCode = (pkg.product as { currencyCode?: string }).currencyCode;
  if (!currencyCode) {
    return pkg.product.priceString;
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    return pkg.product.priceString;
  }
}

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { isConfigured, isReady, isEntitled, purchasePackage, restorePurchases } = usePurchases();
  const { t } = useNotation();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [selectedPlan, setSelectedPlan] = React.useState<PlanType>('annual');
  const [packages, setPackages] = React.useState<PurchasesPackage[]>([]);
  const [purchasing, setPurchasing] = React.useState(false);
  const [restoring, setRestoring] = React.useState(false);
  const [recentSuccessRate, setRecentSuccessRate] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const sessions = await loadGameHistory();
      if (!cancelled && sessions.length > 0) {
        const sample = sessions.slice(0, 5);
        const totalAttempts = sample.reduce((acc, s) => acc + s.attempts, 0);
        const totalFound = sample.reduce((acc, s) => acc + s.found, 0);
        const rate = totalAttempts > 0 ? Math.round((totalFound / totalAttempts) * 100) : null;
        setRecentSuccessRate(rate);
      }
      if (!isConfigured) return;
      try {
        const result = await fetchCurrentPackages();
        if (!cancelled) setPackages(result);
      } catch {
        if (!cancelled) setPackages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isConfigured]);

  React.useEffect(() => {
    if (!isEntitled) return;
    void markLocallyUnlocked().then(() => {
      router.replace('/(tabs)');
    });
  }, [isEntitled]);

  const annualPackage = packages.find((p) => p.packageType === PACKAGE_TYPE.ANNUAL) ?? null;
  const monthlyPackage = packages.find((p) => p.packageType === PACKAGE_TYPE.MONTHLY) ?? null;
  const selectedPackage = selectedPlan === 'annual' ? annualPackage : monthlyPackage;
  const isShortScreen = height < 900;
  const isVeryShortScreen = height < 820;
  const paywallMetrics = {
    headerTop: isShortScreen ? 6 : 10,
    headerBottom: isShortScreen ? 4 : 8,
    headerButtonSize: isShortScreen ? 36 : 40,
    contentTop: isShortScreen ? 4 : 8,
    contentGap: isVeryShortScreen ? 9 : isShortScreen ? 12 : 15,
    titleSize: isShortScreen ? 25 : 29,
    titleLineHeight: isShortScreen ? 29 : 33,
    subtitleSize: isShortScreen ? 20 : 23,
    subtitleLineHeight: isShortScreen ? 24 : 28,
    benefitGap: isShortScreen ? 10 : 13,
    benefitIconSize: isShortScreen ? 40 : 46,
    benefitIconRadius: isShortScreen ? 12 : 14,
    benefitIconGlyph: isShortScreen ? 22 : 25,
    benefitTitleSize: isShortScreen ? 18 : 20,
    benefitTitleLineHeight: isShortScreen ? 23 : 26,
    benefitDescriptionSize: isShortScreen ? 13 : 14,
    benefitDescriptionLineHeight: isShortScreen ? 18 : 20,
    offerGap: isShortScreen ? 7 : 9,
    badgeHeight: isShortScreen ? 24 : 27,
    offerVerticalPadding: isShortScreen ? 10 : 12,
    monthlyVerticalPadding: isShortScreen ? 13 : 15,
    buttonHeight: isShortScreen ? 56 : 62,
    buttonFontSize: isShortScreen ? 16 : 18,
    footerFontSize: isShortScreen ? 11 : 12,
    footerLineHeight: isShortScreen ? 14 : 17,
  };

  const handleBuy = async () => {
    if (!isConfigured) {
      Alert.alert(t('paywallErrorUnavailableTitle'), t('paywallErrorUnavailableBody'));
      return;
    }
    if (!selectedPackage) {
      Alert.alert(t('paywallOfferUnavailableTitle'), t('paywallOfferUnavailableBody'));
      return;
    }
    setPurchasing(true);
    try {
      await purchasePackage(selectedPackage);
      await markLocallyUnlocked();
      router.replace('/(tabs)');
    } catch (error) {
      const e = error as { userCancelled?: boolean };
      if (!e?.userCancelled) {
        Alert.alert(t('paywallPurchaseFailedTitle'), t('paywallPurchaseFailedBody'));
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (!isConfigured) {
      Alert.alert(t('paywallRestoreUnavailableTitle'), t('paywallRestoreUnavailableBody'));
      return;
    }
    setRestoring(true);
    try {
      const info = await restorePurchases();
      if (Object.keys(info.entitlements.active).length > 0) {
        await markLocallyUnlocked();
        router.replace('/(tabs)');
      } else {
        Alert.alert(t('paywallNoSubscriptionTitle'), t('paywallNoSubscriptionBody'));
      }
    } catch {
      Alert.alert(t('paywallErrorTitle'), t('paywallRestoreFailedBody'));
    } finally {
      setRestoring(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: insets.top + paywallMetrics.headerTop,
          paddingHorizontal: 20,
          paddingBottom: paywallMetrics.headerBottom,
        }}
      >
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={{
            width: paywallMetrics.headerButtonSize,
            height: paywallMetrics.headerButtonSize,
            borderRadius: paywallMetrics.headerButtonSize / 2,
            borderWidth: 1,
            borderColor: '#dce7f4',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f6faff',
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#1c2430" />
        </Pressable>
        <Pressable onPress={handleRestore} disabled={restoring}>
          <Text style={{ color: '#5f6f83', fontSize: 14, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
            {restoring ? t('paywallRestoring') : t('paywallRestore')}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: paywallMetrics.contentTop,
          paddingBottom: insets.bottom + 22,
          gap: paywallMetrics.contentGap,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: paywallMetrics.titleSize,
              lineHeight: paywallMetrics.titleLineHeight,
              textAlign: 'center',
              color: '#1c2430',
              letterSpacing: -1.1,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {t('paywallTitle')}
          </Text>
          <Text
            style={{
              marginTop: 2,
              textAlign: 'center',
              color: '#2f80ed',
              fontSize: paywallMetrics.subtitleSize,
              lineHeight: paywallMetrics.subtitleLineHeight,
              letterSpacing: -0.8,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {t('paywallSubtitle')}
          </Text>
        </View>

        <View style={{ gap: paywallMetrics.benefitGap }}>
          {[
            {
              icon: 'trophy-outline',
              title: t('paywallBenefitUnlimitedTitle'),
              description: t('paywallBenefitUnlimitedBody'),
            },
            {
              icon: 'calendar-check-outline',
              title: t('paywallBenefitRoutineTitle'),
              description:
                recentSuccessRate !== null
                  ? fillTemplate(t('paywallBenefitRoutineBody'), { rate: String(recentSuccessRate) })
                  : t('paywallBenefitRoutineFallback'),
            },
            {
              icon: 'trending-up',
              title: t('paywallBenefitExercisesTitle'),
              description: t('paywallBenefitExercisesBody'),
            },
          ].map((item) => (
            <View key={item.title} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <View
                style={{
                  marginTop: 2,
                  width: paywallMetrics.benefitIconSize,
                  height: paywallMetrics.benefitIconSize,
                  borderRadius: paywallMetrics.benefitIconRadius,
                  backgroundColor: '#ebf3ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name={item.icon as never} size={paywallMetrics.benefitIconGlyph} color="#2f80ed" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#1c2430',
                    fontSize: paywallMetrics.benefitTitleSize,
                    lineHeight: paywallMetrics.benefitTitleLineHeight,
                    letterSpacing: -0.5,
                    fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    color: '#5f6f83',
                    fontSize: paywallMetrics.benefitDescriptionSize,
                    lineHeight: paywallMetrics.benefitDescriptionLineHeight,
                    fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {!isReady ? (
          <View style={{ paddingVertical: 26 }}>
            <ActivityIndicator size="large" color="#2f80ed" />
          </View>
        ) : (
          <View style={{ gap: paywallMetrics.offerGap }}>
            <Pressable
              onPress={() => setSelectedPlan('annual')}
              style={{
                borderRadius: 18,
                borderWidth: 2,
                borderColor: selectedPlan === 'annual' ? '#2f80ed' : '#dce7f4',
                backgroundColor: selectedPlan === 'annual' ? '#f2f8ff' : '#ffffff',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: paywallMetrics.badgeHeight,
                  backgroundColor: selectedPlan === 'annual' ? '#2f80ed' : '#c7cfdb',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    lineHeight: 14,
                    letterSpacing: 0.8,
                    fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
                    includeFontPadding: false,
                  }}
                >
                  {t('paywallBestOffer')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 12,
                  paddingVertical: paywallMetrics.offerVerticalPadding,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: selectedPlan === 'annual' ? '#2f80ed' : '#c5d4e8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedPlan === 'annual' ? (
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2f80ed' }} />
                    ) : null}
                  </View>
                  <View>
                    <Text style={{ color: '#1c2430', fontSize: 16, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                      {t('paywallAnnual')}
                    </Text>
                    <Text style={{ color: '#5f6f83', fontSize: 13, lineHeight: 17, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
                      {annualPackage ? formatLocalizedPrice(annualPackage.product.price / 52, annualPackage) : t('paywallStoreLoading')} / {t('paywallPerWeek')}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#1c2430', fontSize: 16, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                  {annualPackage ? `${annualPackage.product.priceString} / ${t('paywallPerYear')}` : t('paywallPriceUnavailable')}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setSelectedPlan('monthly')}
              style={{
                borderRadius: 18,
                borderWidth: 2,
                borderColor: selectedPlan === 'monthly' ? '#2f80ed' : '#dce7f4',
                backgroundColor: selectedPlan === 'monthly' ? '#f2f8ff' : '#ffffff',
                paddingHorizontal: 12,
                paddingVertical: paywallMetrics.monthlyVerticalPadding,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: selectedPlan === 'monthly' ? '#2f80ed' : '#c5d4e8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedPlan === 'monthly' ? (
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2f80ed' }} />
                    ) : null}
                  </View>
                  <Text style={{ color: '#1c2430', fontSize: 16, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                    {t('paywallMonthly')}
                  </Text>
                </View>
                <Text style={{ color: '#1c2430', fontSize: 16, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                  {monthlyPackage ? `${monthlyPackage.product.priceString} / ${t('paywallPerMonth')}` : t('paywallPriceUnavailable')}
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <MaterialCommunityIcons name="check" size={18} color="#2f80ed" />
          <Text style={{ color: '#5f6f83', fontSize: 13, lineHeight: 17, fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined }}>
            {t('paywallNoCommitment')}
          </Text>
        </View>

        <Pressable
          onPress={handleBuy}
          disabled={purchasing || !isReady}
          style={({ pressed }) => ({
            height: paywallMetrics.buttonHeight,
            borderRadius: paywallMetrics.buttonHeight / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2f80ed',
            opacity: purchasing || !isReady ? 0.65 : pressed ? 0.9 : 1,
            shadowColor: '#2f80ed',
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          })}
        >
          {purchasing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={{ color: '#ffffff', fontSize: paywallMetrics.buttonFontSize, lineHeight: paywallMetrics.buttonFontSize + 4, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
              {t('paywallUnlock')}
            </Text>
          )}
        </Pressable>

        <Text
          style={{
            textAlign: 'center',
            fontSize: paywallMetrics.footerFontSize,
            color: '#7a8ca8',
            lineHeight: paywallMetrics.footerLineHeight,
            fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
          }}
        >
          {selectedPlan === 'annual' && annualPackage
            ? `${annualPackage.product.priceString} / ${t('paywallPerYear')} (${formatLocalizedPrice(annualPackage.product.price / 12, annualPackage)} / ${t('paywallPerMonth')})`
            : selectedPlan === 'monthly' && monthlyPackage
              ? `${monthlyPackage.product.priceString} / ${t('paywallPerMonth')}`
              : t('paywallFooterFallback')}
        </Text>
      </ScrollView>
    </View>
  );
}
