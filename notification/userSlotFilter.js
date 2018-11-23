const _ = require('underscore');

const userSlotFilter = {};

userSlotFilter.filterSlots = (user, slots) => {
  return slots.filter(slot => {
    const clubSettings = user.slotPreference.find(
      x => x.clubId === slot.clubId
    );

    if (
      clubSettings &&
      clubSettings.toObject().hasOwnProperty('inactivated') &&
      clubSettings.toObject().inactivated
    ) {
      return false;
    }

    return (
      clubSettings &&
      clubSettings.days[slot.date.getDay()] &&
      isTimeInPreferenceRange(clubSettings.days[slot.date.getDay()], slot)
    );
  });
};

userSlotFilter.isPrimeTime = slot => {
  if (slot.startTime > 17) return true;
  if (slot.isOnWeekend() && slot.startTime > 10) return true;
  if (slot.daysFromToday() < 7) return true;
  if (slot.isLunchtimeSlot() && slot.clubId === 0 && slot.daysFromToday() < 5) {
    return true;
  }
  return false;
};

var isTimeInPreferenceRange = (
  timeIntervalsOfPreference,
  { startTime, endTime }
) => {
  for (var index = 0; index < timeIntervalsOfPreference.length; index++) {
    var prefTimeSlot = timeIntervalsOfPreference[index];
    if (
      prefTimeSlot &&
      startTime >= prefTimeSlot.startTime &&
      startTime < prefTimeSlot.endTime
    ) {
      if (prefTimeSlot.active) {
        return true;
      }
    }
  }

  return false;
};

module.exports = userSlotFilter;
