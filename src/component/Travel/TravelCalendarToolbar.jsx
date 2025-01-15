import { Stack, Button, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
// ----------------------------------------------------------------------

// const VIEW_OPTIONS = [
//   { value: "dayGridMonth", label: "Month", icon: "ic:round-view-module" },
//   { value: "timeGridWeek", label: "Week", icon: "ic:round-view-week" },
//   { value: "timeGridDay", label: "Day", icon: "ic:round-view-day" },
//   { value: "listWeek", label: "Agenda", icon: "ic:round-view-agenda" },
// ];

// ----------------------------------------------------------------------

export default function TravelCalendarToolbar({
  date,
  view,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilter,
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: "column", sm: "row" }}
      sx={{ p: 2.5 }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography variant="h5">
          {moment(date).format("DD MMM YYYY")}
        </Typography>

        <IconButton onClick={onNextDate}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Button
          size="small"
          color="error"
          variant="contained"
          onClick={onToday}
        >
          Today
        </Button>
      </Stack>
    </Stack>
  );
}
