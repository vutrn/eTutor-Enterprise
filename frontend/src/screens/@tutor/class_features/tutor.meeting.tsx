import { useCallback, useEffect, useState } from "react";
import { useClassStore } from "../../../store/useClassStore";
import { useMeetingStore } from "../../../store/useMeetingStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";

const TutorMeeting = () => {
  const [visible, setVisible] = useState(false);
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      console.log({ hours, minutes });
    },
    [setVisible]
  );

  const [date, setDate] = useState(undefined);
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params: any) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  return (
    <SafeAreaView>
      <View>
        <Button onPress={() => setVisible(true)} uppercase={false} mode="outlined">
          Pick time
        </Button>
        <TimePickerModal
          locale="en"
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12}
          minutes={14}
        />

        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
          Pick single date
        </Button>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          onConfirm={onConfirmSingle}
          date={date}
        />
      </View>
    </SafeAreaView>
  );
};

export default TutorMeeting;
