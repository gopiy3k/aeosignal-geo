module.exports = {
  // Creates an array like [0, 1, 2, 3, 4, 5]
  // We'll iterate up to 6 placeholders, so length 6 is sufficient.
  numbers: Array.from({length: 6}, (_, i) => i)
};