import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { useMessageStore } from "../../../store/useMessageStore";
import { Button, TextInput } from "react-native-paper";
import { useClassStore } from "../../../store/useClassStore";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";

const TutorMessage = () => {
  const { getUsersToChat, setSelectedUser, users } = useMessageStore();
  const { selectedClass } = useClassStore();

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    getUsersToChat(selectedClass._id);
  }, [selectedClass._id]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    navigation.navigate("tutor_message_detail");
  };

  const renderItem = ({ item }: any) => {
    return (
      <Button mode="contained" style={{ margin: 10 }} onPress={() => handleSelectUser(item)}>
        <Text> {item.username}</Text>
        <Text> {item._id} </Text>
      </Button>
    );
  };

  return (
    <SafeAreaView>
      <FlatList data={users} keyExtractor={(item) => item._id} renderItem={renderItem} />
    </SafeAreaView>
  );
};

export default TutorMessage;
