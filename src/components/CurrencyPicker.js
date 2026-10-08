import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../colors';

export default function CurrencyPicker({ label, currencies, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const current = currencies.find((c) => c.code === selected);
  const filtered = currencies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  function select(code) {
    onChange(code);
    setOpen(false);
    setSearch('');
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.field} onPress={() => setOpen(true)}>
        <Text style={styles.fieldText}>{current ? current.name : selected}</Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{label} qual moeda?</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text style={styles.close}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Buscar moeda..."
            placeholderTextColor={colors.mutedText}
            keyboardAppearance="dark"
            value={search}
            onChangeText={setSearch}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => select(item.code)}>
                <Text style={[styles.itemText, item.code === selected && styles.itemSelected]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, color: colors.mutedText, marginBottom: 6, marginTop: 14 },
  field: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldText: { color: colors.text, fontSize: 16, flex: 1 },
  arrow: { color: colors.green, fontSize: 16, marginLeft: 8 },
  modal: { flex: 1, backgroundColor: colors.background, paddingTop: 70, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold' },
  close: { color: colors.green, fontSize: 16, fontWeight: '600' },
  search: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.card },
  itemText: { color: colors.text, fontSize: 16 },
  itemSelected: { color: colors.green, fontWeight: 'bold' },
});
