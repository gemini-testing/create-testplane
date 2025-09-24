// Read more about configuring Testplane at https://testplane.io/docs/v8/config/main/
module.exports = {
    foo: Boolean(100 + 500 * 1),
    bar: 4,
    baz: '4',
    array: [
        Boolean(100 + 500 * 1)
    ],
    specials: /\n\t\r/g,
    extraSlash: /\, \, \\/g
};
