/**
 * date.js
 * format: DD/MM/YYYY : hh:mm:ss 
 */
module.exports.getCurrentDate = () => {
  const now = new Date();
  const day = ('0' + now.getDate()).slice(-2); // Ensure two digits for day
  const month = ('0' + (now.getMonth() + 1)).slice(-2); // Ensure two digits for month
  const hours = ('0' + now.getHours()).slice(-2); // Ensure two digits for hours
  const minutes = ('0' + now.getMinutes()).slice(-2); // Ensure two digits for minutes
  const seconds = ('0' + now.getSeconds()).slice(-2); // Ensure two digits for seconds
  const formattedDate = `${day}/${month}/${now.getFullYear()} : ${hours}:${minutes}:${seconds} `;
  return formattedDate;
};
