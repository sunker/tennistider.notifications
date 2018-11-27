const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const notificationSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: {
      unique: true
    }
  },
  timestamp: {
    type: Date
  },
  createdAt: { type: Date, expires: '30d', default: Date.now }
})

notificationSchema.methods = {
  isDayInPreferenceRange: (date) => {
    return this.jsDaysOfPreference.indexOf(date) !== -1
  }
}

notificationSchema.statics = {
  removeOld: function () {
    Notification.find({
      timestamp: {
        $lt: new Date()
      }
    }, function (err, notifications) {
      console.log(notifications.length)
      Notification.find({}, function (err, notifications) {
        console.log(notifications.length)
      })
    })
  },
  containsKey: function (key) {
    return new Promise((resolve, reject) => {
      Notification.findOne({
        'key': key
      }, function (err, key) {
        if (err) {
          reject(err)
        } else {
          if (key) resolve(true)
          else resolve(false)
        }
      })
    })
  },
  add: function (notification) {
    return new Promise((resolve, reject) => {
      notification.save(function (err) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(true)
          console.log('Notification created')
        }
      })
    })
  }
}

const Notification = mongoose.model('notification', notificationSchema)

module.exports = Notification
