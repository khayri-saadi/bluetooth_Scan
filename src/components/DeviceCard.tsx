import React, { useEffect, useState } from 'react';
import { useNavigation  } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity , View } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { RootStackParamList } from '../navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
type DeviceCardProps = {
  device: Device;
};

const DeviceCard = ({ device }: DeviceCardProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // is the device connected?
    device.isConnected().then(setIsConnected);
  }, [device]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Device', { device })}>
        <Text style={{fontSize:16 , color:'#111', fontWeight:'bold'}}>{`Name : ${device.name}`}</Text>
        <Icon name='perm-device-info' size={30}  style={{ color:'#70b5f9', marginLeft:'10%'}}/> 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    shadowRadius: 10,
    elevation: 4,
    padding: 16,
    marginTop : 12,
    flexDirection:'row',
    borderColor:'#C0C0C0',
    borderWidth:1.5
  
  },
});

export { DeviceCard };
