import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { PACKAGE_TYPE, type PurchasesPackage } from 'react-native-purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePurchases } from '@/contexts/purchases-context';
import { fetchCurrentPackages } from '@/lib/purchases/offerings';
import { loadGameHistory } from '@/storage/gameHistory';
import { markLocallyUnlocked } from '@/storage/paywallAccess';

type PlanType = 'annual' | 'weekly';

function formatEuro(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} €`;
}

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { isConfigured, isReady, isEntitled, purchasePackage, restorePurchases } = usePurchases();
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
  const weeklyPackage = packages.find((p) => p.packageType === PACKAGE_TYPE.WEEKLY) ?? null;
  const selectedPackage = selectedPlan === 'annual' ? annualPackage : weeklyPackage;

  const handleBuy = async () => {
    if (!isConfigured) {
      Alert.alert('Achat indisponible', 'RevenueCat n’est pas encore configuré sur cette build.');
      return;
    }
    if (!selectedPackage) {
      Alert.alert('Offre indisponible', 'Réessaie dans quelques secondes.');
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
        Alert.alert('Paiement échoué', 'Une erreur est survenue. Réessaie ou restaure ton achat.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (!isConfigured) {
      Alert.alert('Restauration indisponible', 'RevenueCat n’est pas encore configuré sur cette build.');
      return;
    }
    setRestoring(true);
    try {
      const info = await restorePurchases();
      if (Object.keys(info.entitlements.active).length > 0) {
        await markLocallyUnlocked();
        router.replace('/(tabs)');
      } else {
        Alert.alert('Aucun abonnement actif', 'Aucun achat restaurable trouvé.');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de restaurer les achats.');
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
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
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
            {restoring ? 'Restauration…' : 'Restaurer'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 12,
          paddingBottom: insets.bottom + 26,
          gap: 22,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <Text
            style={{
              fontSize: 30,
              lineHeight: 34,
              textAlign: 'center',
              color: '#1c2430',
              letterSpacing: -1.1,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            FretPlay Pro
          </Text>
          <Text
            style={{
              marginTop: 4,
              textAlign: 'center',
              color: '#2f80ed',
              fontSize: 24,
              lineHeight: 30,
              letterSpacing: -0.8,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            Continue ta progression
          </Text>
        </View>

        <View style={{ gap: 16, marginBottom: 2 }}>
          {[
            {
              icon: 'trophy-outline',
              title: 'Accès illimité',
              description: 'Joue autant que tu veux, sans limite quotidienne.',
            },
            {
              icon: 'calendar-check-outline',
              title: 'Routine quotidienne, progrès rapides',
              description:
                recentSuccessRate !== null
                  ? `Tu es déjà à ${recentSuccessRate}% de réussite sur tes dernières sessions.`
                  : 'Quelques minutes par jour suffisent pour accélérer tes réflexes sur le manche.',
            },
            {
              icon: 'trending-up',
              title: 'Tous les exercices débloqués',
              description: 'Modes avancés, intervalles, gammes... et nouvelles features premium à venir.',
            },
          ].map((item) => (
            <View key={item.title} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
              <View
                style={{
                  marginTop: 2,
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#ebf3ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name={item.icon as never} size={25} color="#2f80ed" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#1c2430',
                    fontSize: 20,
                    lineHeight: 26,
                    letterSpacing: -0.5,
                    fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    color: '#5f6f83',
                    fontSize: 14,
                    lineHeight: 20,
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
          <View style={{ gap: 12, marginTop: 4 }}>
            <Pressable
              onPress={() => setSelectedPlan('annual')}
              style={{
                borderRadius: 18,
                borderWidth: 2,
                borderColor: selectedPlan === 'annual' ? '#2f80ed' : '#dce7f4',
                backgroundColor: selectedPlan === 'annual' ? '#f2f8ff' : '#ffffff',
                padding: 14,
                paddingTop: selectedPlan === 'annual' ? 26 : 14,
                position: 'relative',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  backgroundColor: selectedPlan === 'annual' ? '#2f80ed' : '#c7cfdb',
                  paddingVertical: 5,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    letterSpacing: 0.8,
                    fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
                  }}
                >
                  MEILLEURE OFFRE
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      Annuel
                    </Text>
                    <Text style={{ color: '#5f6f83', fontSize: 13, lineHeight: 17, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
                      {annualPackage ? formatEuro(annualPackage.product.price / 52) : '0,87 €'} / semaine
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#1c2430', fontSize: 16, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                  {annualPackage ? `${annualPackage.product.priceString} / an` : '44,99 € / an'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setSelectedPlan('weekly')}
              style={{
                borderRadius: 18,
                borderWidth: 2,
                borderColor: selectedPlan === 'weekly' ? '#2f80ed' : '#dce7f4',
                backgroundColor: selectedPlan === 'weekly' ? '#f2f8ff' : '#ffffff',
                padding: 14,
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
                      borderColor: selectedPlan === 'weekly' ? '#2f80ed' : '#c5d4e8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedPlan === 'weekly' ? (
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2f80ed' }} />
                    ) : null}
                  </View>
                  <Text style={{ color: '#1c2430', fontSize: 16, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                    Hebdo
                  </Text>
                </View>
                <Text style={{ color: '#1c2430', fontSize: 16, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                  {weeklyPackage ? `${weeklyPackage.product.priceString} / semaine` : '5,99 € / semaine'}
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="check" size={20} color="#2f80ed" />
          <Text style={{ color: '#5f6f83', fontSize: 14, lineHeight: 18, fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined }}>
            Sans engagement - Résilie à tout moment
          </Text>
        </View>

        <Pressable
          onPress={handleBuy}
          disabled={purchasing || !isReady}
          style={({ pressed }) => ({
            marginTop: 2,
            height: 68,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2f80ed',
            opacity: purchasing || !isReady ? 0.65 : pressed ? 0.9 : 1,
            shadowColor: '#2f80ed',
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6,
          })}
        >
          {purchasing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={{ color: '#ffffff', fontSize: 18, lineHeight: 22, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
              Débloquer l’accès illimité
            </Text>
          )}
        </Pressable>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#7a8ca8',
            lineHeight: 17,
            fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
          }}
        >
          {selectedPlan === 'annual' && annualPackage
            ? `${annualPackage.product.priceString} / an (${formatEuro(annualPackage.product.price / 12)} / mois)`
            : selectedPlan === 'weekly' && weeklyPackage
              ? `${weeklyPackage.product.priceString} / semaine`
              : 'Tarifs affichés dans la boutique au moment du paiement.'}
        </Text>
      </ScrollView>
    </View>
  );
}
