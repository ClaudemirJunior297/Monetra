import { ActivityIndicator, RefreshControl, ScrollView, Text, View, Dimensions } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import Svg, { Path, Circle, G } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { useTransactions } from "@/contexts/TransactionContext";

const { width } = Dimensions.get("window");
const PIZZA_SIZE = width * 0.6;
const RADIUS = PIZZA_SIZE / 2;
const CENTER = RADIUS;

const currency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const SLICE_COLORS = [
  "#c859ff", "#4FC3F7", "#66BB6A", "#FF8C42",
  "#F48FB1", "#FFD54F", "#80CBC4", "#EF9A9A",
];

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

function PizzaChart({ entries, total }: { entries: [string, number][]; total: number }) {
  if (entries.length === 0) return null;

  let currentAngle = 0;
  const slices = entries.map(([cat, amt], i) => {
    const pct = ((amt || 0) / total) * 100;
    const angle = (pct / 100) * 360;
    const path = slicePath(CENTER, CENTER, RADIUS - 20, currentAngle, currentAngle + angle);
    currentAngle += angle;
    return { cat, amt, pct, path, color: SLICE_COLORS[i % SLICE_COLORS.length] };
  });

  return (
    <View style={{ alignItems: "center", marginVertical: 16 }}>
      <Svg width={PIZZA_SIZE} height={PIZZA_SIZE}>
        <G>
          {slices.map((slice, i) => (
            <Path key={i} d={slice.path} fill={slice.color} stroke="#0D0D18" strokeWidth={2} />
          ))}
          <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.38} fill="#0D0D18" />
        </G>
      </Svg>
    </View>
  );
}

export default function Graphs() {
  const c = useColors();
  const { summary, transactions, loading, error, refresh } = useTransactions();

  const entries = Object.entries(summary.categoryBreakdown).sort(([, a], [, b]) => (b || 0) - (a || 0));

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const SLICE_COLORS_LOCAL = [
    "#c859ff", "#4FC3F7", "#66BB6A", "#FF8C42",
    "#F48FB1", "#FFD54F", "#80CBC4", "#EF9A9A",
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.primary} />}>

      {/* Header */}
      <View style={{ backgroundColor: c.card, padding: 24, paddingTop: 52, alignItems: "center", borderBottomWidth: 1, borderBottomColor: c.border }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: c.text }}>Indicadores</Text>
        <Text style={{ fontSize: 13, color: c.sub, marginTop: 4 }}>Baseados nas transacoes cadastradas</Text>
      </View>

      {error ? <Text style={{ color: c.error, padding: 16 }}>{error}</Text> : null}

      {/* Cards resumo */}
      <View style={{ flexDirection: "row", gap: 12, padding: 16 }}>
        <View style={{ flex: 1, backgroundColor: c.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: c.border, alignItems: "center" }}>
          <Text style={{ fontSize: 11, color: c.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Despesas</Text>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#ef5350", marginTop: 4 }}>{currency(summary.totalExpense)}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: c.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: c.border, alignItems: "center" }}>
          <Text style={{ fontSize: 11, color: c.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Transacoes</Text>
          <Text style={{ fontSize: 20, fontWeight: "800", color: c.primary, marginTop: 4 }}>{transactions.length}</Text>
        </View>
      </View>

      {loading && transactions.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <ActivityIndicator color={c.primary} size="large" />
        </View>
      ) : null}

      {!loading && entries.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 48, gap: 8 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: c.text }}>Sem despesas para analisar</Text>
          <Text style={{ fontSize: 13, color: c.sub, textAlign: "center", paddingHorizontal: 32 }}>Os graficos aparecem quando houver despesas salvas.</Text>
        </View>
      ) : null}

      {entries.length > 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: c.text, marginBottom: 4 }}>Distribuicao por categoria</Text>
          <Text style={{ fontSize: 12, color: c.sub, marginBottom: 16 }}>Total: {currency(summary.totalExpense)}</Text>

          {/* GRAFICO DE PIZZA */}
          <View style={{ backgroundColor: c.card, borderRadius: 20, borderWidth: 1, borderColor: c.border, alignItems: "center", paddingVertical: 16, marginBottom: 20 }}>
            <PizzaChart entries={entries} total={summary.totalExpense} />

            {/* Legenda */}
            <View style={{ width: "100%", paddingHorizontal: 20, gap: 8 }}>
              {entries.map(([cat, amt], i) => {
                const pct = summary.totalExpense > 0 ? (((amt || 0) / summary.totalExpense) * 100).toFixed(0) : "0";
                return (
                  <View key={cat} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: SLICE_COLORS_LOCAL[i % SLICE_COLORS_LOCAL.length] }} />
                    <Text style={{ flex: 1, fontSize: 13, color: c.text }}>{cat}</Text>
                    <Text style={{ fontSize: 13, color: c.sub }}>{pct}%</Text>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: c.text }}>{currency(amt || 0)}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Barras */}
          <Text style={{ fontSize: 16, fontWeight: "700", color: c.text, marginBottom: 12 }}>Detalhamento</Text>
          <View style={{ backgroundColor: c.card, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: c.border, marginBottom: 20 }}>
            {entries.map(([cat, amt], i) => {
              const pct = summary.totalExpense > 0 ? Math.min(((amt || 0) / summary.totalExpense) * 100, 100) : 0;
              const color = SLICE_COLORS_LOCAL[i % SLICE_COLORS_LOCAL.length];
              return (
                <View key={cat} style={{ padding: 14, borderBottomWidth: i < entries.length - 1 ? 1 : 0, borderBottomColor: c.border }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: c.text }}>{cat}</Text>
                    <Text style={{ fontSize: 13, color: c.sub }}>{currency(amt || 0)}</Text>
                  </View>
                  <View style={{ height: 6, backgroundColor: c.border, borderRadius: 3, overflow: "hidden" }}>
                    <View style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 3 }} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}

    </ScrollView>
  );
}
