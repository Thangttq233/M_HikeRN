
// src/screens/ObservationFormScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { addObservation } from '../repositories/observations';

export default function ObservationFormScreen({ route, navigation }) {
  const hikeId = route.params?.hikeId;
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');

  const onSave = async () => {
    if (!content.trim()) {
      Alert.alert('Validation', 'Observation is required');
      return;
    }
    await addObservation(hikeId, { content, note, timestamp: new Date().toISOString() });
    navigation.goBack();
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <Text>Observation *</Text>
      <TextInput value={content} onChangeText={setContent} placeholder="Animal sighting, weather..." style={styles.input} />

      <Text style={{ marginTop:8 }}>Additional notes</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="Optional" style={styles.input} />

      <View style={{ height:12 }} />
      <Button title="Save" onPress={onSave} />
    </View>
  );
}

const styles = {
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:4 }
};
