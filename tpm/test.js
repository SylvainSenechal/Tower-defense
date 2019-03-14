const obj = {
  a: 1,
  b: "oui",
  c: () => 3+4
}

// var obj = {
//   firstName: "John",
//   lastName : "Doe",
//   id       : 5566,
//   fullName : function() {
//     return this.firstName + " " + this.lastName;
//   }
// };

console.log(obj.c())


const fn = n =>
  n > 5 ?
  n < 10 ? 1 : 2
  : 3

console.log(fn(11))
