import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Button, View } from "react-native";
import { Characteristic } from "react-native-ble-plx";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Base64 } from "../lib/base64";
import { useNavigation } from "@react-navigation/native";
type CharacteristicCardProps = {
  char: Characteristic;
};

const CharacteristicCard = ({ char }: CharacteristicCardProps) => {
  const navigation = useNavigation();
  const [measure1, setMeasure1] = useState("");
  const [measure, setMeasure] = useState({ heart: "70", spo2: "99", pi: "3.5" });
  const [descriptor, setDescriptor] = useState<string | null>("");
  const decodeBleString = (value: string | undefined | null): string => {
    if (!value) {
      return "";
    }

    const raw = Base64.atob(value);
    let result = "";
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : "0" + hex;
    }
    result.toUpperCase();

    let heartRate = result[2] + result[3];
    let spo2 = result[4] + result[5];
    let pi = result[6] + result[7];
    let intSpo2 = parseInt(spo2, 16);
    let intHartRate = parseInt(heartRate, 16);
    let intPi = parseInt(pi, 16);
    let floatPI = intPi / 10;

    const data = { heart: intHartRate, spo2: intSpo2, pi: floatPI };
    return data;
  };

  useEffect(() => {
    char.monitor((err, cha) => {
      if (err) {
        //console.warn("ERROR");
        //console.log("err in char.monitor");
        setMeasure({ heart: "70", spo2: "99", pi: "3.5" });
        return;
      }
      // each received value has to be decoded with a Base64 algorythm you can find on the Internet (or in my repository 😉)
     // console.log(cha?.value?.length); /* base64 */
      setMeasure1(cha?.value);
      if (cha?.value?.length === 8) {
        setMeasure(decodeBleString(cha?.value));
      }
    });
  }, [char]);


  return (
    <>
      <TouchableOpacity
        key={char.uuid}
        style={styles.container}
      >
        <Text style={styles.measure}>HeartRate : {measure.heart}</Text>
        <Text style={styles.measure}>Pi : {measure.pi}</Text>
        <Text style={styles.measure}>Spo2 : {measure.spo2}</Text>
      </TouchableOpacity>
      <View style={styles.btnContainer}>
        <Button
          title="more details"
          color={"#009387"}
          onPress={() => {
            navigation.navigate("Details", { measure });
          }}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: "rgba(60,64,67,0.3)",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 12,
  },
  btnContainer: {
    padding: 10,
  },
  measure: { color: "red", fontSize: 24 },
  descriptor: { color: "blue", fontSize: 24 },
});

export { CharacteristicCard };