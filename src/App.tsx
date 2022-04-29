import { Fragment, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { VStack, Button, NativeBaseProvider, Box } from "native-base";
import { Calendar, CalendarProps } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import useAlarm, { formatTime } from "./useAlarm";
import useLedger from "./useLedger";
import useToday from "./useToday";

type MarkedDatesType = NonNullable<CalendarProps["markedDates"]>;

export default function App() {
  const today = useToday();
  const [ledger, setLedger] = useLedger();
  const [ready, alarm, setAlarm] = useAlarm();
  const [timePicker, setTimePicker] = useState<JSX.Element>();

  const medsTaken = Boolean(ledger[today]);

  const markedDates = useMemo(() => {
    const markedDates: MarkedDatesType = {};

    Object.entries(ledger).forEach(([date, selected]) => {
      if (selected) {
        markedDates[date] = { selected, selectedColor: "#27ae60" };
      }
    });

    return markedDates;
  }, [ledger]);

  function takeMeds() {
    setLedger({ ...ledger, [today]: true });
  }

  function changeAlarm() {
    const value = new Date();

    if (alarm) {
      value.setHours(alarm.hour);
      value.setMinutes(alarm.minute);
    }

    setTimePicker(
      <DateTimePicker
        is24Hour
        mode="time"
        value={value}
        onChange={(_: any, value: Date | undefined) => {
          setTimePicker(undefined);

          if (value) {
            const hour = value.getHours();
            const minute = value.getMinutes();

            setAlarm({ hour, minute });
          }
        }}
      />
    );
  }

  return (
    <>
      <NativeBaseProvider>
        <StatusBar style="auto" />
        <VStack
          alignItems="stretch"
          my="auto"
          px={8}
          space={4}
          flex={1}
          justifyContent="center"
          style={{ backgroundColor: "#fff" }}
        >
          {ready && (
            <>
              <Box mb={8}>
                <Calendar markedDates={markedDates} />
              </Box>
              <Button
                variant="outline"
                disabled={medsTaken}
                colorScheme={medsTaken ? "green" : "red"}
                size="lg"
                style={{ height: 70 }}
                onPress={() => takeMeds()}
              >
                {medsTaken ? "Meds Taken" : "Take Meds"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                style={{ height: 70 }}
                onPress={() => changeAlarm()}
              >
                {alarm ? `Alarm: ${formatTime(alarm)}` : "Set Alarm"}
              </Button>
            </>
          )}
        </VStack>
      </NativeBaseProvider>
      {timePicker}
    </>
  );
}
