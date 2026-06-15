import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useTransactions } from "@/contexts/TransactionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

const currency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  "Alimentacao": { icon: "coffee", color: "#FF8C42", bg: "#3A2010" },
  "Alimentação": { icon: "coffee", color: "#FF8C42", bg: "#3A2010" },
  "Transporte": { icon: "navigation", color: "#4FC3F7", bg: "#0A2A3A" },
  "Lazer": { icon: "music", color: "#CE93D8", bg: "#2A1A3A" },
  "Saude": { icon: "heart", color: "#EF9A9A", bg: "#3A1010" },
  "Saúde": { icon: "heart", color: "#EF9A9A", bg: "#3A1010" },
  "Educacao": { icon: "book", color: "#80CBC4", bg: "#0A2A2A" },
  "Educação": { icon: "book", color: "#80CBC4", bg: "#0A2A2A" },
  "Renda": { icon: "trending-up", color: "#66BB6A", bg: "#0A2A10" },
  "Renda Extra": { icon: "star", color: "#FFD54F", bg: "#2A2A0A" },
};
const getMeta = (cat: string) => CATEGORY_META[cat] || { icon: "tag", color: "#c859ff", bg: "#1A1A2E" };

function BalanceCard({ summary }: { summary: any }) {
  const { user } = useAuth();
  const c = useColors();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ backgroundColor: c.card, borderRadius: 24, padding: 22, marginBottom: 24, borderWidth: 1, borderColor: c.border }, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 14, color: c.sub, marginBottom: 4 }}>Ola, {user?.name?.split(" ")[0] || "usuario"}</Text>
          <Text style={{ fontSize: 11, color: c.sub, letterSpacing: 1 }}>SALDO DISPONIVEL</Text>
        </View>
        <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: c.border, alignItems: "center", justifyContent: "center" }}>
          <Feather name="user" size={18} color={c.primary} />
        </View>
      </View>
      <Text style={{ fontSize: 38, fontWeight: "800", color: c.text, letterSpacing: -1, marginBottom: 18 }}>{currency(summary.balance)}</Text>
      <View style={{ height: 1, backgroundColor: c.border, marginBottom: 18 }} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: "#0A2A10", alignItems: "center", justifyContent: "center" }}>
            <Feather name="arrow-down-circle" size={15} color="#66BB6A" />
          </View>
          <View>
            <Text style={{ fontSize: 10, color: c.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Receitas</Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#66BB6A", marginTop: 1 }}>{currency(summary.totalIncome)}</Text>
          </View>
        </View>
        <View style={{ width: 1, height: 28, backgroundColor: c.border, marginHorizontal: 14 }} />
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: "#3A1010", alignItems: "center", justifyContent: "center" }}>
            <Feather name="arrow-up-circle" size={15} color="#ef5350" />
          </View>
          <View>
            <Text style={{ fontSize: 10, color: c.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Despesas</Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#ef5350", marginTop: 1 }}>{currency(summary.totalExpense)}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function CategoryRow({ category, amount, total, index }: any) {
  const c = useColors();
  const fade = useRef(new Animated.Value(0)).current;
  const barW = useRef(new Animated.Value(0)).current;
  const meta = getMeta(category);
  const pct = total > 0 ? Math.min(((amount || 0) / total) * 100, 100) : 0;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 70),
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(barW, { toValue: pct, tension: 50, friction: 8, useNativeDriver: false }),
      ]),
    ]).start();
  }, [pct]);

  return (
    <Animated.View style={[{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: c.border }, { opacity: fade }]}>
      <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: meta.bg, alignItems: "center", justifyContent: "center" }}>
        <Feather name={meta.icon as any} size={14} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: c.text }}>{category}</Text>
          <Text style={{ fontSize: 13, color: c.sub }}>{currency(amount || 0)}</Text>
        </View>
        <View style={{ height: 5, backgroundColor: c.border, borderRadius: 3, overflow: "hidden" }}>
          <Animated.View style={{ height: "100%", borderRadius: 3, backgroundColor: meta.color, width: barW.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) }} />
        </View>
      </View>
    </Animated.View>
  );
}

function TxRow({ transaction, index }: any) {
  const c = useColors();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const meta = getMeta(transaction.category);
  const isIncome = transaction.type === "income";

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 60),
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: c.border }, { opacity: fade, transform: [{ translateX: slide }] }]}>
      <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: meta.bg, alignItems: "center", justifyContent: "center" }}>
        <Feather name={meta.icon as any} size={15} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: c.text }} numberOfLines={1}>{transaction.description}</Text>
        <Text style={{ fontSize: 11, color: c.sub, marginTop: 2 }}>{transaction.category} · {transaction.date.toLocaleDateString("pt-BR")}</Text>
      </View>
      <Text style={{ fontSize: 14, fontWeight: "700", color: isIncome ? "#66BB6A" : "#ef5350" }}>
        {isIncome ? "+" : "-"}{currency(transaction.amount)}
      </Text>
    </Animated.View>
  );
}

export default function Dashboard() {
  const c = useColors();
  const { transactions, summary, loading, error, refresh } = useTransactions();
  const cats = Object.entries(summary.categoryBreakdown).sort(([, a], [, b]) => (b || 0) - (a || 0));
  const recent = transactions.slice(0, 5);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 52 }} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.primary} />}>

      <BalanceCard summary={summary} />

      {error ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#3A1010", borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <Feather name="alert-circle" size={14} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontSize: 13, flex: 1 }}>{error}</Text>
        </View>
      ) : null}

      {loading && transactions.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <ActivityIndicator color={c.primary} size="large" />
        </View>
      ) : null}

      {!loading && transactions.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 48, gap: 10 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.card, alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
            <Feather name="inbox" size={36} color={c.primary} />
          </View>
          <Text style={{ fontSize: 17, fontWeight: "700", color: c.text }}>Nenhuma transacao</Text>
          <Text style={{ fontSize: 13, color: c.sub, textAlign: "center", lineHeight: 20, paddingHorizontal: 24 }}>Registre sua primeira receita ou despesa.</Text>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: c.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, marginTop: 6 }}
            onPress={() => router.push("/(tabs)/add")}>
            <Feather name="plus" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Registrar transacao</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {cats.length > 0 ? (
        <View style={{ marginBottom: 22 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: c.text }}>Gastos por categoria</Text>
            <Text style={{ fontSize: 12, color: c.sub }}>{cats.length} categorias</Text>
          </View>
          <View style={{ backgroundColor: c.card, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: c.border }}>
            {cats.map(([cat, amt], i) => <CategoryRow key={cat} category={cat} amount={amt} total={summary.totalExpense} index={i} />)}
          </View>
        </View>
      ) : null}

      {recent.length > 0 ? (
        <View style={{ marginBottom: 22 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: c.text }}>Recentes</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/transaction")}>
              <Text style={{ fontSize: 13, color: c.primary, fontWeight: "600" }}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: c.card, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: c.border }}>
            {recent.map((tx, i) => <TxRow key={tx.id} transaction={tx} index={i} />)}
          </View>
        </View>
      ) : null}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
