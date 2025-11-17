
// src/components/ConfirmModal.js
import React from 'react';
import { Modal, View, Text, Button, ScrollView } from 'react-native';

export default function ConfirmModal({ visible, onCancel, onConfirm, data }) {
  if (!data) return null;
  const Row = ({ label, value }) => (
    <View style={{ marginVertical: 6 }}>
      <Text style={{ fontWeight: '600' }}>{label}</Text>
      <Text>{String(value ?? '')}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center' }}>
        <View style={{ margin:16, padding:16, backgroundColor:'#fff', borderRadius:12, maxHeight:'80%' }}>
          <Text style={{ fontSize:18, fontWeight:'700', marginBottom:8 }}>Confirm Hike Details</Text>
          <ScrollView>
            <Row label="Name" value={data.name} />
            <Row label="Location" value={data.location} />
            <Row label="Date" value={data.date} />
            <Row label="Parking" value={data.parking ? 'Yes' : 'No'} />
            <Row label="Length (km)" value={data.length} />
            <Row label="Difficulty" value={data.difficulty} />
            <Row label="Description" value={data.description} />
            <Row label="Field1" value={data.field1} />
            <Row label="Field2" value={data.field2} />
          </ScrollView>
          <View style={{ flexDirection:'row', justifyContent:'flex-end', marginTop:12 }}>
            <Button title="Back" onPress={onCancel} />
            <View style={{ width:8 }} />
            <Button title="Save" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
