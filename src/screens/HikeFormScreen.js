
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Button, ScrollView, Alert } from 'react-native';
import { createHike, getHike, updateHike } from '../repositories/hikes';
import ConfirmModal from '../components/ConfirmModal';
import { validateHike } from '../utils/validate';

const DIFFICULTIES = ['Easy', 'Moderate', 'Hard'];

export default function HikeFormScreen({ route, navigation }) {
  const editId = route.params?.id; // <= nếu có id → chế độ Edit

  const [values, setValues] = useState({
    name: '', location: '', date: '', parking: false, length: '', difficulty: '',
    description: '', field1: '', field2: ''
  });
  const [errors, setErrors] = useState({});
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    if (editId) {
      (async () => {
        const data = await getHike(editId);
        if (data) {
          setValues({
            name: data.name, location: data.location, date: data.date,
            parking: !!data.parking, length: String(data.length), difficulty: data.difficulty,
            description: data.description || '', field1: data.field1 || '', field2: data.field2 || ''
          });
        }
      })();
    }
  }, [editId]);

  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }));

  const onSubmit = () => {
    const e = validateHike(values);
    setErrors(e);
    if (Object.keys(e).length === 0) setConfirmVisible(true);
    else Alert.alert('Validation', Object.values(e).join('\n'));
  };

  const onConfirmSave = async () => {
    setConfirmVisible(false);
    try {
      if (editId) {
        await updateHike(editId, { ...values, length: Number(values.length) });
        Alert.alert('Updated', `Hike #${editId} updated`);
      } else {
        const newId = await createHike({ ...values, length: Number(values.length) });
        Alert.alert('Saved', `Hike #${newId} created`);
      }
      // Quay về List để đảm bảo focus reload
      navigation.navigate('HikeList');
    } catch (e) {
      console.error('Save error', e);
      Alert.alert('Save failed', String(e?.message || e));
    }
  };

  const ErrorText = ({ msg }) => (msg ? <Text style={{ color:'#b00020' }}>{msg}</Text> : null);

  return (
    <View style={{ flex:1, padding:12 }}>
      <ScrollView>
        <Text>Name *</Text>
        <TextInput value={values.name} onChangeText={(t)=>set('name', t)} placeholder="Snowdon" style={styles.input}/>
        <ErrorText msg={errors.name} />

        <Text style={{ marginTop:8 }}>Location *</Text>
        <TextInput value={values.location} onChangeText={(t)=>set('location', t)} placeholder="Wales, UK" style={styles.input}/>
        <ErrorText msg={errors.location} />

        <Text style={{ marginTop:8 }}>Date *</Text>
        <TextInput value={values.date} onChangeText={(t)=>set('date', t)} placeholder="2025-11-15" style={styles.input}/>
        <ErrorText msg={errors.date} />

        <View style={{ flexDirection:'row', alignItems:'center', marginTop:8 }}>
          <Text style={{ flex:1 }}>Parking *</Text>
          <Switch value={values.parking} onValueChange={(v)=>set('parking', v)} />
        </View>
        <ErrorText msg={errors.parking} />

        <Text style={{ marginTop:8 }}>Length (km) *</Text>
        <TextInput keyboardType="numeric" value={values.length} onChangeText={(t)=>set('length', t)} placeholder="10" style={styles.input}/>
        <ErrorText msg={errors.length} />

        <Text style={{ marginTop:8 }}>Difficulty *</Text>
        <View style={{ flexDirection:'row', marginVertical:4 }}>
          {['Easy','Moderate','Hard'].map((d) => (
            <Button key={d} title={d} onPress={()=>set('difficulty', d)} color={values.difficulty===d ? '#1976d2' : undefined} />
          ))}
        </View>
        <ErrorText msg={errors.difficulty} />

        <Text style={{ marginTop:8 }}>Description</Text>
        <TextInput value={values.description} onChangeText={(t)=>set('description', t)} placeholder="Optional" style={styles.input}/>

        <Text style={{ marginTop:8 }}>Field 1</Text>
        <TextInput value={values.field1} onChangeText={(t)=>set('field1', t)} placeholder="Custom field" style={styles.input}/>

        <Text style={{ marginTop:8 }}>Field 2</Text>
        <TextInput value={values.field2} onChangeText={(t)=>set('field2', t)} placeholder="Custom field" style={styles.input}/>

        <View style={{ height:12 }} />
        <Button title={editId ? 'Update' : 'Create'} onPress={onSubmit} />
      </ScrollView>

      <ConfirmModal
        visible={confirmVisible}
        data={values}
        onCancel={()=>setConfirmVisible(false)}
        onConfirm={onConfirmSave}
      />
    </View>
  );
}

const styles = {
  input: {
    borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:4
  }
};
