import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccent, ACCENTS } from "@/contexts/AccentContext";
import { useState, useRef, useEffect } from "react";

export default function Profile() {
  const { user, signOut, updateName } = useAuth() as any;
  const { isDark, toggleTheme } = useTheme();
  const { accent, accentColor, setAccent } = useAccent();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  const bg = isDark ? "#0D0D18" : "#F0F0F8";
  const card = isDark ? "#1A1A2E" : "#FFFFFF";
  const border = isDark ? "#2A2A4A" : "#E0E0F0";
  const textColor = isDark ? "#FFFFFF" : "#111111";
  const subColor = isDark ? "#888888" : "#666666";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const saveName = () => {
    if (name.trim().length < 3) {
      Alert.alert("Nome invalido", "O nome deve ter pelo menos 3 caracteres.");
      return;
    }
    updateName(name.trim());
    setEditing(false);
    Alert.alert("Salvo!", "Nome atualizado.");
  };

  const savePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Campos obrigatorios", "Preencha todos os campos.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Senha fraca", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Senhas diferentes", "A nova senha e a confirmacao nao conferem.");
      return;
    }
    setShowPasswordModal(false);
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    Alert.alert("Senha alterada!", "Sua senha foi atualizada com sucesso.");
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar a sessao?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  };

  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <ScrollView style={[s.root, { backgroundColor: bg }]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <Animated.View style={[s.header, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <View style={[s.avatarFallback, { backgroundColor: accentColor + "22", borderColor: accentColor + "44", borderWidth: 2 }]}>
          <Text style={[s.initials, { color: accentColor }]}>{initials || "?"}</Text>
        </View>

        {editing ? (
          <View style={s.editRow}>
            <TextInput
              style={[s.nameInput, { borderColor: accentColor, backgroundColor: card, color: textColor }]}
              value={name}
              onChangeText={setName}
              autoFocus
              placeholder="Seu nome"
              placeholderTextColor={subColor}
            />
            <TouchableOpacity style={[s.saveBtn, { backgroundColor: accentColor }]} onPress={saveName}>
              <Feather name="check" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={s.nameRow} onPress={() => setEditing(true)} activeOpacity={0.7}>
            <Text style={[s.name, { color: textColor }]}>{name || "Seu nome"}</Text>
            <Feather name="edit-2" size={14} color={subColor} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
        <Text style={[s.email, { color: subColor }]}>{user?.email}</Text>
      </Animated.View>

      {/* COR DO TEMA */}
      <View style={s.section}>
        <Text style={[s.secTitle, { color: subColor }]}>COR DO TEMA</Text>
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={s.themeRow}>
            {ACCENTS.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[s.circle, { backgroundColor: a.color }, accent === a.id && { borderWidth: 3, borderColor: "#fff" }]}
                onPress={() => setAccent(a.id)}
                activeOpacity={0.8}
              >
                {accent === a.id && <Feather name="check" size={14} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[s.themeLabel, { color: subColor }]}>
            {ACCENTS.find(a => a.id === accent)?.label}
          </Text>
        </View>
      </View>

      {/* APARENCIA */}
      <View style={s.section}>
        <Text style={[s.secTitle, { color: subColor }]}>APARENCIA</Text>
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <View style={[s.rowIcon, { backgroundColor: isDark ? "#2A1A3A" : "#F0E0FF" }]}>
                <Feather name={isDark ? "moon" : "sun"} size={15} color={accentColor} />
              </View>
              <View>
                <Text style={[s.rowTitle, { color: textColor }]}>Modo {isDark ? "escuro" : "claro"}</Text>
                <Text style={[s.rowSub, { color: subColor }]}>Aparencia do aplicativo</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: border, true: accentColor + "66" }}
              thumbColor={isDark ? accentColor : "#ccc"}
            />
          </View>
        </View>
      </View>

      {/* CONTA */}
      <View style={s.section}>
        <Text style={[s.secTitle, { color: subColor }]}>CONTA</Text>
        <View style={[s.card, { backgroundColor: card, borderColor: border }]}>
          <TouchableOpacity style={s.row} onPress={() => setShowPasswordModal(true)} activeOpacity={0.7}>
            <View style={s.rowLeft}>
              <View style={[s.rowIcon, { backgroundColor: isDark ? "#0A2A3A" : "#E0F4FF" }]}>
                <Feather name="lock" size={15} color="#4FC3F7" />
              </View>
              <View>
                <Text style={[s.rowTitle, { color: textColor }]}>Alterar senha</Text>
                <Text style={[s.rowSub, { color: subColor }]}>Atualize sua senha</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={subColor} />
          </TouchableOpacity>

          <View style={[s.separator, { backgroundColor: border }]} />

          <TouchableOpacity style={s.row} activeOpacity={0.7}
            onPress={() => Alert.alert("Privacidade", "Seus dados sao armazenados com seguranca e nunca compartilhados com terceiros.")}>
            <View style={s.rowLeft}>
              <View style={[s.rowIcon, { backgroundColor: isDark ? "#0A2A10" : "#E0FFE8" }]}>
                <Feather name="shield" size={15} color="#66BB6A" />
              </View>
              <View>
                <Text style={[s.rowTitle, { color: textColor }]}>Privacidade</Text>
                <Text style={[s.rowSub, { color: subColor }]}>Como seus dados sao usados</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={subColor} />
          </TouchableOpacity>

          <View style={[s.separator, { backgroundColor: border }]} />

          <TouchableOpacity style={s.row} activeOpacity={0.7}
            onPress={() => Alert.alert("Excluir conta", "Esta acao e irreversivel. Deseja continuar?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Excluir", style: "destructive", onPress: () => Alert.alert("Em breve", "Funcionalidade disponivel em breve.") },
            ])}>
            <View style={s.rowLeft}>
              <View style={[s.rowIcon, { backgroundColor: isDark ? "#3A1010" : "#FFE0E0" }]}>
                <Feather name="trash-2" size={15} color="#ef5350" />
              </View>
              <View>
                <Text style={[s.rowTitle, { color: "#ef5350" }]}>Excluir conta</Text>
                <Text style={[s.rowSub, { color: subColor }]}>Remove todos os seus dados</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={subColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SAIR */}
      <TouchableOpacity style={[s.logoutBtn, { borderColor: "#ef535033" }]} onPress={handleLogout} activeOpacity={0.8}>
        <Feather name="log-out" size={18} color="#ef5350" />
        <Text style={s.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />

      {/* MODAL ALTERAR SENHA */}
      <Modal visible={showPasswordModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: card, borderColor: border }]}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { color: textColor }]}>Alterar senha</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Feather name="x" size={20} color={subColor} />
              </TouchableOpacity>
            </View>

            <Text style={[s.inputLabel, { color: subColor }]}>Senha atual</Text>
            <TextInput
              style={[s.input, { backgroundColor: bg, borderColor: border, color: textColor }]}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="••••••"
              placeholderTextColor={subColor}
            />

            <Text style={[s.inputLabel, { color: subColor }]}>Nova senha</Text>
            <TextInput
              style={[s.input, { backgroundColor: bg, borderColor: border, color: textColor }]}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••"
              placeholderTextColor={subColor}
            />

            <Text style={[s.inputLabel, { color: subColor }]}>Confirmar nova senha</Text>
            <TextInput
              style={[s.input, { backgroundColor: bg, borderColor: border, color: textColor }]}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••"
              placeholderTextColor={subColor}
            />

            <TouchableOpacity style={[s.modalBtn, { backgroundColor: accentColor }]} onPress={savePassword} activeOpacity={0.8}>
              <Text style={s.modalBtnText}>Salvar senha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 52 },
  header: { alignItems: "center", marginBottom: 28 },
  avatarFallback: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  initials: { fontSize: 30, fontWeight: "800" },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  name: { fontSize: 22, fontWeight: "800" },
  email: { fontSize: 13 },
  editRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6, width: "100%" },
  nameInput: { flex: 1, fontSize: 16, fontWeight: "700", borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  saveBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  section: { marginBottom: 20 },
  secTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 },
  card: { borderRadius: 20, overflow: "hidden", borderWidth: 1, padding: 16 },
  themeRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
  circle: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  themeLabel: { fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowTitle: { fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 1 },
  separator: { height: 1, marginVertical: 2 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#3A1010", borderRadius: 16, padding: 16, borderWidth: 1 },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#ef5350" },
  modalOverlay: { flex: 1, backgroundColor: "#00000088", justifyContent: "flex-end" },
  modalBox: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderWidth: 1, gap: 8 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  inputLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, marginTop: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginTop: 4 },
  modalBtn: { borderRadius: 14, padding: 14, alignItems: "center", marginTop: 12 },
  modalBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
