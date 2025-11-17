// HikeListScreen.js
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { listHikes, deleteHike, resetDb } from '../repositories/hikes';

export default function HikeListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // Load danh sách hikes
  const load = async () => {
    setRefreshing(true);
    try {
      let data = await listHikes();
      if (search.trim()) {
        data = data.filter((h) =>
          h.name.toLowerCase().includes(search.trim().toLowerCase())
        );
      }
      setItems(data);
    } catch (e) {
      Alert.alert('Load failed', String(e));
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [search])
  );

  // Xóa 1 hike
  const handleDelete = (id) => {
    Alert.alert('Delete hike', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteHike(id);
          load();
        },
      },
    ]);
  };

  // Empty state
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="image-filter-hdr" size={60} color="#6b6b6b" />
      <Text style={styles.emptyTitle}>No hikes found</Text>
      <Text style={styles.emptyDesc}>Try adjusting your search filters</Text>
    </View>
  );

  // Render 1 item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons
          name="hiking"
          size={36}
          color="#2e7d32"
          style={{ marginRight: 12 }}
        />
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('HikeDetail', { id: item.id })}
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.location}</Text>
          <Text style={styles.cardInfo}>
            Length: {item.length} km | Difficulty: {item.difficulty}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titleMain}>Hiking</Text>
          <Text style={styles.titleSub}>Tracker</Text>
          <Text style={styles.subtitle}>Track your adventures</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() =>
              Alert.alert('Reset DB', 'Delete all hikes?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: async () => {
                    await resetDb();
                    load();
                  },
                },
              ])
            }
          >
            <Ionicons name="reload-outline" size={18} color="#333" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('HikeForm')}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add Hike</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={18} color="#777" />
          <TextInput
            placeholder="Quick search by name..."
            style={styles.searchInput}
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* FILTER BUTTON */}
        <TouchableOpacity style={styles.filterBtn} onPress={() => Alert.alert('Filter', 'Filter pressed')}>
          <Ionicons name="options-outline" size={18} color="#333" />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={
          items.length === 0 && { flexGrow: 1, justifyContent: 'center' }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  titleMain: { fontSize: 22, fontWeight: '700', color: '#000' },
  titleSub: { fontSize: 22, fontWeight: '700', color: '#2c7c41' },
  subtitle: { marginTop: 4, color: '#666', fontSize: 12 },
  headerButtons: { flexDirection: 'row', gap: 8 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  resetText: { marginLeft: 5, fontWeight: '600', color: '#333' },
  addBtn: { flexDirection: 'row', backgroundColor: '#2e7d32', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  addBtnText: { marginLeft: 4, color: '#fff', fontWeight: '600' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: '#ddd', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6 },
  searchInput: { marginLeft: 8, flex: 1 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', borderColor: '#ddd', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginLeft: 8 },
  filterText: { marginLeft: 5, fontWeight: '600', color: '#333' },
  emptyContainer: { alignItems: 'center', marginTop: -40 },
  emptyTitle: { marginTop: 12, fontSize: 16, color: '#333', fontWeight: '600' },
  emptyDesc: { marginTop: 4, color: '#777' },
  card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, backgroundColor: '#fafafa' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  cardSubtitle: { color: '#555', marginTop: 4 },
  cardInfo: { marginTop: 6, color: '#777', fontSize: 12 },
});
