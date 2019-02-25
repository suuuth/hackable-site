
module.exports = {
  index: function () {
    console.log ( 'Hello world!' )
  },
  pushToArray: function (data) {
    let array = []
    array.push({ data: data })

    return array
  }
}
