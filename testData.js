const TimeSlot = require('./models/TimeSlot'),
  mongoose = require('mongoose'),
  User = mongoose.model('user')

exports.addTestUser = () => {
  var user = new User()
  user.email = 'erik.sundell87@gmail.com'
  user.password = 'hejsan'
  user.active = true
  user.firstTimeUser = true
  user.slotPreference = [{
    clubId: 1,
    days: [
      [new TimeSlot(8, 21).toJSON()], // sunday
      [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()], // monday
      [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()], // thuesday..
      [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13).toJSON(), new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(8, 21).toJSON()]
    ]
  }, {
    clubId: 2,
    days: [
      [new TimeSlot(8, 21).toJSON()], // Sunday
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(8, 20).toJSON()]
    ]
  }, {
    clubId: 3,
    days: [
      [new TimeSlot(8, 20).toJSON()], // Sunday
      [new TimeSlot(17, 20).toJSON()],
      [new TimeSlot(17, 20).toJSON()],
      [new TimeSlot(17, 20).toJSON()],
      [new TimeSlot(17, 20).toJSON()],
      [new TimeSlot(17, 20).toJSON()],
      [new TimeSlot(8, 20).toJSON()]
    ]
  }, {
    clubId: 20,
    days: [
      [new TimeSlot(8, 21).toJSON()], // Sunday
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(8, 20).toJSON()]
    ]
  }, {
    clubId: 21,
    days: [
      [new TimeSlot(8, 21).toJSON()], // Sunday
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(8, 20).toJSON()]
    ]
  }, {
    clubId: 22,
    days: [
      [new TimeSlot(8, 21).toJSON()], // Sunday
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(17, 21).toJSON()],
      [new TimeSlot(8, 20).toJSON()]
    ]
  }]

//   User.add(user)
}
