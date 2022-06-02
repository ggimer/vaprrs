//functions
module.exports.formatDate = function formatDate(dateTime) {
  let dateSplit = ("" + dateTime).split(" ");
  let date = "";
  for (i = 1; i < 5; i++) {
    date += `${dateSplit[i]} `;
  }

  // console.log("" + dateTime);

  return date;
};
