
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHike, deleteHike } from '../repositories/hikes';
import { listObservations, deleteObservation } from '../repositories/observations';

export default function HikeDetailScreen({ route, navigation }) {
  const id = route.params?.id;
  const [hike, setHike] = useState(null);
  const [obs, setObs] = useState([]);

  const load = async () => {
    const h = await getHike(id);
    setHike(h);
    const o = await listObservations(id);
    setObs(o);
  };

  useFocusEffect(useCallback(() => {
    load();
  }, [id]));

  const confirmDeleteHike = () => {
    Alert.alert('Delete hike', 'Are you sure you want to delete this hike?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteHike(id);
          // quay về list (chắc chắn) thay vì goBack trong trường hợp stack lồng
          navigation.navigate('HikeList');
        }
      }
    ]);
  };

  const confirmDeleteObs = (obsId) => {
    Alert.alert('Delete observation', 'Delete this observation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteObservation(obsId);
          load();
        }
      }
    ]);
  };

  if (!hike) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const Row = ({ label, value }) => (
    <View style={{ marginVertical:4 }}>
      <Text style={{ fontWeight:'600' }}>{label}</Text>
      <Text>{String(value ?? '')}</Text>
    </View>
  );

  const ObsItem = ({ item }) => (
    <View style={{ padding:10, borderBottomWidth:1, borderColor:'#eee' }}>
      <Text style={{ fontWeight:'600' }}>{item.content}</Text>
      <Text style={{ color:'#555' }}>{item.timestamp}</Text>
      {!!item.note && <Text>{item.note}</Text>}
      <View style={{ flexDirection:'row', marginTop:6 }}>
        <Button title="Delete" color="#b00020" onPress={() => confirmDeleteObs(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={{ flex:1, padding:12 }}>
      <Text style={{ fontSize:18, fontWeight:'700', marginBottom:6 }}>{hike.name}</Text>
      <Row label="Location" value={hike.location} />
      <Row label="Date" value={hike.date} />
      <Row label="Parking" value={hike.parking ? 'Yes' : 'No'} />
      <Row label="Length (km)" value={hike.length} />
      <Row label="Difficulty" value={hike.difficulty} />
      {!!hike.description && <Row label="Description" value={hike.description} />}
      {!!hike.field1 && <Row label="Field1" value={hike.field1} />}
      {!!hike.field2 && <Row label="Field2" value={hike.field2} />}

      <View style={{ flexDirection:'row', justifyContent:'space-between', marginVertical:10 }}>
        <Button title="Edit" onPress={() => navigation.navigate('HikeForm', { id })} />
        <Button title="Add Observation" onPress={() => navigation.navigate('ObservationForm', { hikeId: id })} />
        <Button title="Delete Hike" color="#b00020" onPress={confirmDeleteHike} />
      </View>

      <Text style={{ fontSize:16, fontWeight:'700', marginBottom:6 }}>Observations</Text>
      <FlatList
        data={obs}
        keyExtractor={(it) => String(it.id)}
        renderItem={ObsItem}
        ListEmptyComponent={<Text>No observations yet</Text>}
      />
    </View>
  );
}
