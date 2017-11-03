require('../models/Notification')
require('../models/Slot')

const mongoose = require('mongoose'),
  User = mongoose.model('user'),
  Slot = mongoose.model('slot'),
  Notification = mongoose.model('notification'),
  userSlotFilter = require('./userSlotFilter'),
  mailClient = require('./mailClient'),
  Mail = require('../models/Mail')

module.exports = {
  async notifyUser(slots, email) {
    return new Promise(async(resolve, reject) => {
      var time = new Date().getHours()
      if (time >= 7 && time < 23) {
        let mail = new Mail(slots, email)
        mailClient.sendEmail(mail).then(() => {
          console.log(`Mail sent to: ${email}`)
          resolve()
        }).catch(err => {
          console.log(`Could not send mail to: ${email}. Error: ${err}`)
          reject()
        })
      } else {
        reject()
      }
    })
  },
  async init() {
    console.log('Time:', new Date().getHours())
    const users = await User.getAll().then(users => users.filter(x => x.email === 'erik.sundell87@gmail.com'))
    const slots = await Slot.getAll()
    Promise.all(users.map(user => {
      return new Promise(async(resolve) => {
        let slotsOfInterest = userSlotFilter.filterSlots(user, slots)
        let primeTimeSlots = slotsOfInterest.filter(slot => userSlotFilter.isPrimeTime(slot))
        const newSlots = await Promise.all(primeTimeSlots.map(async slot => {
          const notificationAlreadySent = await Notification.containsKey(slot.getKey(user.email))
          return notificationAlreadySent ? undefined : {
            key: slot.getKey(user.email),
            slot: slot
          }
        })).then(result => result.filter(x => x).map(y => y.slot))

        if (newSlots.length > 0) {
          this.notifyUser(newSlots, user.email).then(async() => {
            const result = await Promise.all(newSlots.map(slot => Notification.add(new Notification({ key: slot.getKey(user.email), timestamp: slot.date }))))
            console.log(`${result.filter(x => x).length} slots saved`)
            resolve()
          }, () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    }))
      .then(() => setTimeout(() => this.init(), process.env.NODE_ENV === 'debug' ? 1000 : 20000))
      .catch(() => setTimeout(() => this.init(), process.env.NODE_ENV === 'debug' ? 1000 : 60000))
  }
}
