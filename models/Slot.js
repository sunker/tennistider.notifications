const mongoose = require('mongoose'),
  TimeSlot = require('./TimeSlot'),
  Schema = mongoose.Schema

const slotSchema = new Schema({
  id: {
    type: Schema.ObjectId
  },
  key: {
    type: String,
    required: true,
    unique: true,
    index: {
      unique: true
    }
  },
  date: Date,
  startTime: Number,
  endTime: Number,
  clubId: Number,
  clubName: String,
  price: Number,
  courtNumber: Number,
  surface: String,
  link: String,
  type: String
})

slotSchema.methods = {
  timeSlot() {
    return new TimeSlot(Number(this.startTime, this.endTime))
  },
  isOnWeekend() {
    return (this.date.getDay() === 6) || (this.date.getDay() === 0)
  },
  isMorningSlot() {
    return (!this.isOnWeekend() && this.startTime >= 7 && this.endTime <= 9)
  },
  isLunchtimeSlot() {
    return (!this.isOnWeekend() && this.startTime >= 11 && this.endTime <= 13)
  },
  isWeekdayNightSlot() {
    return (!this.isOnWeekend() && this.startTime >= 17)
  },
  getSlotKey() {
    return this.date.getFullYear() + '_' + (this.date.getMonth() + 1) + '_' + this.date.getDate() + '_' + this.clubId + '_' + this.startTime.toFixed(2).toString() + '-' + this.endTime.toFixed(2).toString() + '_' + (this.surface ? this.surface : 'uknownsurface') + '_' + this.courtNumber + '_' + this.type
  },
  getSlotKeyExcludingCourtNumber() {
    return this.date.getFullYear() + '_' + (this.date.getMonth() + 1) + '_' + this.date.getDate() + '_' + this.clubId + '_' + this.startTime.toFixed(2).toString() + '-' + this.endTime.toFixed(2).toString() + '_' + (this.surface ? this.surface : 'uknownsurface') + '_' + this.type
  },
  daysFromToday() {
    const ONE_DAY = 1000 * 60 * 60 * 24
    const date1ms = new Date().getTime()
    const date2ms = this.date.getTime()
    const differencems = Math.abs(date1ms - date2ms)

    return Math.round(differencems / ONE_DAY)
  },
  getKey(userId) {
    return userId + '_' + this.getSlotKey()
  },
  toString() {
    return this.toSwedishDay() + ' ' + this.date.getDate() + '/' + (this.date.getMonth() + 1) + ' kl ' + this.startTime.toFixed(2).toString() + '-' + this.endTime.toFixed(2).toString() + ' ' + (this.surface ? this.surface : '')
  },
  toSwedishDay() {
    switch (this.date.getDay()) {
      case 1:
        return 'måndag'
      case 2:
        return 'tisdag'
      case 3:
        return 'onsdag'
      case 4:
        return 'torsdag'
      case 5:
        return 'fredag'
      case 6:
        return 'lördag'
      case 0:
        return 'söndag'
      default:
        return ''
    }
  }
}

slotSchema.statics = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const hour = new Date().getHours()
      // Slot.find({ date: { $gte: new Date() }, startTime: { $gte: hour } }, function (err, slots) {
      Slot.find({ date: { $gte: new Date() } }, function (err, slots) {
        if (err) {
          reject(err)
        } else {
          resolve(slots)
        }
      })
    })
  }
}

const Slot = mongoose.model('slot', slotSchema)

module.exports = Slot
