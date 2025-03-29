import { useCallback, useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
import { useClassStore } from "../../../store/useClassStore";
import { useMeetingStore } from "../../../store/useMeetingStore";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const TutorMeeting = () => {
  const { selectedClass } = useClassStore();
  const { getMeetingsByClass } = useMeetingStore();
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();

  useEffect(() => {
    getMeetingsByClass(selectedClass._id);
  }, []);

  const [open, setOpen] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  // const onDismiss = useCallback(() => setVisible(false), []);
  // const onConfirm = useCallback(({ hours, minutes }) => {
  //   setTime({ hours, minutes });
  //   setVisible(false);
  // }, []);

  const [visible, setVisible] = useState(false);
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: any) => {
      setVisible(false);
      console.log({ hours, minutes });
    },
    [setVisible]
  );

  // Web-specific layout
  if (isWeb) {
    return (
      <SafeAreaView>
        <Card style={styles.webCard}>
          <Card.Content>
            <Title>Schedule Meeting</Title>
            <Paragraph>Select date and time for your meeting</Paragraph>

            <View style={styles.webDateContainer}>
              <View style={styles.webDatePicker}>
                <Text style={styles.webLabel}>Select Date:</Text>
                <DateTimePicker
                  mode="single"
                  date={selected}
                  onChange={({ date }) => setSelected(date)}
                  styles={{
                    ...defaultStyles,
                    today: { borderWidth: 2, borderColor: "blue" },
                    button_prev: {
                      // tintColor: "white",
                      // backgroundColor: "#161616",
                      // borderRadius: 5,
                      width: 25,
                      height: 25,
                    },
                    button_next: {
                      // tintColor: "white",
                      // backgroundColor: "#161616",
                      // borderRadius: 5,
                      width: 25,
                      height: 25,
                    },
                  }}
                />
              </View>
              <View style={styles.webTimePicker}>
                <Text style={styles.webLabel}>Select Time</Text>

                <TimePickerModal
                  locale="en"
                  visible={visible}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  use24HourClock
                />
              </View>
            </View>
            <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
              <Button onPress={() => setVisible(true)} uppercase={false} mode="outlined">
                Pick time
              </Button>
            </View>

            <View style={styles.webButtonContainer}>
              <Button mode="contained" style={styles.webSubmitButton}>
                Schedule Meeting
              </Button>
            </View>
          </Card.Content>
        </Card>
      </SafeAreaView>
    );
  }

  // Mobile layout (original)
  // return (
  //   <SafeAreaProvider>
  //     <View>
  //       <DateTimePicker
  //         mode="single"
  //         date={selected}
  //         onChange={({ date }) => setSelected(date)}
  //         styles={defaultStyles}
  //       />
  //       <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
  //         Pick single date
  //       </Button>

  //     </View>
  //   </SafeAreaProvider>
  // );
};

const styles = StyleSheet.create({
  webContainer: {
    padding: 20,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  webCard: {
    elevation: 4,
    borderRadius: 8,
  },
  webDateContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginVertical: 20,
    // flexWrap: "wrap",
  },
  webDatePicker: {
    width: "50%",
    minWidth: 100,
    marginBottom: 20,
  },
  webTimePicker: {
    width: "48%",
    minWidth: 100,
    marginBottom: 20,
  },
  webLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  webTimeButton: {
    marginTop: 8,
    height: 50,
    justifyContent: "center",
  },
  webButtonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  webSubmitButton: {
    paddingHorizontal: 24,
  },
});

export default TutorMeeting;
