import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';

const App = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [nome, setNome] = useState('');
  const [rota, setRota] = useState('');
  const [placa, setPlaca] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [hora, setHora] = useState('');
  const [zap, setZap] = useState('');
  const [local, setLocal] = useState(null);

  useEffect(() => {
    fetchDenuncias();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão de localização negada');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocal({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const fetchDenuncias = async () => {
    try {
      const response = await fetch('http://192.168.1.2:3000/denuncias');
      const data = await response.json();
      setDenuncias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addDenuncia = async () => {
    if (!nome || !rota || !veiculo || !placa || !hora || !zap || !local) {
      Alert.alert('Erro', 'Preencha todos os campos e aguarde a localização ser obtida');
      return;
    }

    const denuncia = { nome, rota, veiculo, placa, hora, zap, local };

    try {
      const response = await fetch('http://192.168.1.2:3000/denuncias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(denuncia),
      });
      if (response.ok) {
        fetchDenuncias();
        setNome('');
        setRota('');
        setVeiculo('');
        setPlaca('');
        setHora('');
        setZap('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDenuncia = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.2:3000/denuncias/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchDenuncias();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.nome}</Text>
      <Text style={styles.text}>{item.rota}</Text>
      <Text style={styles.text}>{item.veiculo}</Text>
      <Text style={styles.text}>{item.placa}</Text>
      <Text style={styles.text}>{item.hora}</Text>
      <Text style={styles.text}>{item.zap}</Text>
      <Text style={styles.text}>Local: {item.local.latitude}, {item.local.longitude}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDenuncia(item._id)}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rotas</Text>
      <ScrollView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Rota"
          value={rota}
          onChangeText={setRota}
        />
        <TextInput
          style={styles.input}
          placeholder="Veiculo"
          value={veiculo}
          onChangeText={setVeiculo}
        />
        <TextInput
          style={styles.input}
          placeholder="Placa"
          value={placa}
          onChangeText={setPlaca}
        />
        <TextInput
          style={styles.input}
          placeholder="Hora"
          value={hora}
          onChangeText={setHora}
        />
        <TextInput
          style={styles.input}
          placeholder="WhatsApp"
          value={zap}
          onChangeText={setZap}
        />
        <TouchableOpacity style={styles.addButton} onPress={addDenuncia}>
          <Text style={styles.addButtonText}>Adicionar Rota</Text>
        </TouchableOpacity>
      </ScrollView>
      <FlatList
        data={denuncias}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;