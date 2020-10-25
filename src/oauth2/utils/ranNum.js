
var roundNumber = function RndNum(n) {
  let rNumber = "";
  for (let i = 0; i < n; i++)
    rNumber += Math.floor(Math.random() * 10);
  return rNumber;
}

export default roundNumber;
