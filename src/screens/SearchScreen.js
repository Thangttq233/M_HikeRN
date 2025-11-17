
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { searchHikesByNamePrefix, searchHikesAdvanced } from '../repositories/hikes';

export default function SearchScreen({ navigation }) {
  // Form
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [results, setResults] = useState([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const typingTimer = useRef(null);

  const runBasic = useCallback(async (q) => {
    if (!q?.trim()) {
      setResults([]);
      return;
    }
    const rows = await searchHikesByNamePrefix(q.trim(), 50);
    setResults(rows);
  }, []);

  // Debounce cho ô Name (search cơ bản theo prefix)
  useEffect(() => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      runBasic(name);
    }, 350);
    return () => typingTimer.current && clearTimeout(typingTimer.current);
  }, [name, runBasic]);

  const onAdvancedSearch = async () => {
    const rows = await searchHikesAdvanced({
      name,
      location,
      minLength: minLength.length ? Number(minLength) : undefined,
      maxLength: maxLength.length ? Number(maxLength) : undefined,
      fromDate,
      toDate,
      limit: 200,
    });
    setResults(rows);
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('HikeDetail', { id: item.id })}
      style={{ padding:12, borderBottomWidth:1, borderColor:'#eee' }}
    >
      <Text style={{ fontWeight:'700' }}>{item.name}</Text>
      <Text>{item.location} • {item.date} • {item.difficulty} • {item.length} km</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex:1 }}>
      <ScrollView contentContainerStyle={{ padding:12 }}>
        <Text style={{ fontWeight:'700' }}>Search by name (prefix)</Text>
        <TextInput
          placeholder="Enter first letters, e.g. 'Sno'"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Button
          title={advancedOpen ? 'Hide advanced filters' : 'Show advanced filters'}
          onPress={() => setAdvancedOpen((v)=>!v)}
        />

        {advancedOpen && (
          <View style={{ marginTop:8 }}>
            <Text style={{ marginTop:8 }}>Location (contains)</Text>
            <TextInput placeholder="e.g. Wales" value={location} onChangeText={setLocation} style={styles.input} />

            <View style={{ flexDirection:'row', gap:8 }}>
              <View style={{ flex:1 }}>
                <Text style={{ marginTop:8 }}>Min length (km)</Text>
                <TextInput keyboardType="numeric" value={minLength} onChangeText={setMinLength} style={styles.input} />
              </View>
              <View style={{ flex:1 }}>
                <Text style={{ marginTop:8 }}>Max length (km)</Text>
                <TextInput keyboardType="numeric" value={maxLength} onChangeText={setMaxLength} style={styles.input} />
              </View>
            </View>

            <View style={{ flexDirection:'row', gap:8 }}>
              <View style={{ flex:1 }}>
                <Text style={{ marginTop:8 }}>From date (yyyy-mm-dd)</Text>
                <TextInput value={fromDate} onChangeText={setFromDate} style={styles.input} />
              </View>
              <View style={{ flex:1 }}>
                <Text style={{ marginTop:8 }}>To date (yyyy-mm-dd)</Text>
                <TextInput value={toDate} onChangeText={setToDate} style={styles.input} />
              </View>
            </View>

            <View style={{ height:8 }} />
            <Button title="Run advanced search" onPress={onAdvancedSearch} />
          </View>
        )}

        <Text style={{ marginTop:12, color:'#555' }}>{results.length} result(s)</Text>
      </ScrollView>

      <FlatList
        data={results}
        keyExtractor={(it) => String(it.id)}
        renderItem={Item}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:16 }}>No results</Text>}
      />
    </View>
  );
}

const styles = {
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:4 }
};
